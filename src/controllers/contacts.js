import * as fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user._id,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const createContactController = async (req, res, next) => {
  let photo = null;

  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await saveFileToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    photo = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'photos', req.file.filename),
    );

    photo = `http://localhost:3000/photo/${req.file.filename}`;
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  let photo = null;

  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await saveFileToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      const newPath = path.resolve(
        'src',
        'uploads',
        'photos',
        req.file.filename,
      );
      await fs.rename(req.file.path, newPath);
      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  const payload = { ...req.body };
  if (photo) {
    payload.photo = photo;
  }

  const result = await updateContact(
    { _id: contactId, userId: req.user._id },
    payload,
    { new: true },
  );

  if (result === null) {
    throw new createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact({ _id: contactId, userId: req.user._id });

  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found!');
  }
  res.status(204).end();
};
