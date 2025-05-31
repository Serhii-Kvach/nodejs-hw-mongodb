import createHttpError from 'http-errors';
import { SessionsModel } from '../models/Session.js';
import { UserModel } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(createHttpError(401, 'Please provide Authorization header.'));
    return;
  }

  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer' || !accessToken) {
    next(createHttpError(401, 'Authorization header must be of type Bearer'));
    return;
  }

  const session = await SessionsModel.findOne({ accessToken });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired.'));
  }

  const user = await UserModel.findOne({ _id: session.userId });
  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};
