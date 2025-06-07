import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
} from '../services/auth.js';

export async function registerController(req, res) {
  const data = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
}

function setupSession(res, session) {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshSessionController(req, res) {
  const session = await refreshUserSession({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function sendResetEmailController(req, res) {
  const { email } = req.body;

  await sendResetEmail(email);
  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
