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

router.get('/', jsonParser, ctrlWrapper(getAllContactsController));

router.get('/:contactId', jsonParser, ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(updateContactController));

router.delete('/:contactId', jsonParser, ctrlWrapper(deleteContactController));

export default router;
