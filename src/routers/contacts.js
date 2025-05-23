import express, { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
const jsonParser = express.json();

router.get('/contacts', jsonParser, ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  ctrlWrapper(deleteContactController),
);

export default router;
