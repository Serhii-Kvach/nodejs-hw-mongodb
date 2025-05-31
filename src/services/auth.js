import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { SessionsModel } from '../models/Session.js';
import { UserModel } from '../models/User.js';

export const registerUser = async (payload) => {
  const user = await UserModel.findOne({
    email: payload.email,
  });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserModel.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Invalid email or password');

  await SessionsModel.deleteOne({ userId: user._id });

  const accessToken = randomBytes(50).toString('base64');
  const refreshToken = randomBytes(50).toString('base64');

  return await SessionsModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

const createSession = () => {
  const accessToken = randomBytes(50).toString('base64');
  const refreshToken = randomBytes(50).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};

export const refreshUserSession = async (sessionId, refreshToken) => {
  const session = await SessionsModel.findOne({ _id: sessionId });
  console.log(session);
  if (!session)
    throw createHttpError(401, 'User not authorized, please log in!');

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isRefreshTokenExpired)
    throw createHttpError(401, 'A session token has expired.');

  await SessionsModel.deleteOne({ _id: sessionId, refreshToken });
  const newSession = createSession();

  return await SessionsModel.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsModel.deleteOne({ _id: sessionId });
};
