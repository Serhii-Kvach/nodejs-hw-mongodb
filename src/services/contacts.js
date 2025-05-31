import { Contacts } from '../models/contact.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = Contacts.find({ userId });
  try {
    const [contacts, total] = await Promise.all([
      Contacts.find()
        .merge(contactsQuery)
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder }),
      Contacts.countDocuments(),
    ]);

    const paginationData = calculatePaginationData(total, page, perPage);
    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contacts.findById({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const result = await Contacts.findByIdAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    { new: true },
  );

  return result;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
