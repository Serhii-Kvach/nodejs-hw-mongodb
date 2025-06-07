import * as fs from 'node:fs';
import path from 'node:path';

import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SessionsModel } from '../models/Session.js';
import { UserModel } from '../models/User.js';
import { sendMail } from '../utils/sendMail.js';

const RESER_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password-email.hbs'),
  'utf-8',
);

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

export async function sendResetEmail(email) {
  const user = await UserModel.findOne({ email });

  if (user === null) {
    throw new createHttpError.NotFound('User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const template = Handlebars.compile(RESER_PASSWORD_TEMPLATE);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail(user.email, 'Request to reset your password', html);
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await UserModel.findById(decoded.sub);
    if (user === null) {
      throw new createHttpError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    await SessionsModel.deleteOne({ userId: user._id });
  } catch (error) {
    console.log(error);
    throw createHttpError(401, 'Token is expired or invalid.');
  }
}
