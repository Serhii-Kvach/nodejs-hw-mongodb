import express, { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = Router();
const jsonParser = express.json();

router.get('/contacts', jsonParser, ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(getContactByIdController),
);

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(updateContactController),
);

router.delete(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(deleteContactController),
);

export default router;
