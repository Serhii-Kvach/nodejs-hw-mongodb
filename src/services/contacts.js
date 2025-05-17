import { Contacts } from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contacts.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await Contacts.findByIdAndUpdate(
    {
      _id: contactId,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!result || !result.value) return null;

  return {
    contact: result.value,
    isNew: Boolean(result?.lastErrorObject.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
