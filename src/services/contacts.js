import { Contacts } from '../models/contact.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  try {
    const [contacts, total] = await Promise.all([
      Contacts.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder }),
      Contacts.countDocuments(filter),
    ]);

    const paginationData = calculatePaginationData(total, perPage, page);
    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const result = await Contacts.findByIdAndUpdate(
    {
      _id: contactId,
    },
    payload,
    { new: true },
  );

  return result;
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
