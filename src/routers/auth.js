import express, { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authSchema.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshSessionController,
} from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/refresh', jsonParser, ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;
