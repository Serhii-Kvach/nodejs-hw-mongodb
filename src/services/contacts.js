import { Contacts } from '../models/contact.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  userId,
  filter,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find();

  contactsQuery.where('userId').equals(userId);

  const [total, contacts] = await Promise.all([
    Contacts.countDocuments(contactsQuery),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    totalItems: total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = async ({ _id, userId }) => {
  const contact = await Contacts.findOne({ _id, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async ({ _id, userId }, payload) => {
  const result = await Contacts.findOneAndUpdate(
    {
      _id,
      userId,
    },
    payload,
    { new: true },
  );

  return result;
};

export const deleteContact = async ({ _id, userId }) => {
  const contact = await Contacts.findOneAndDelete({
    _id,
    userId,
  });

  return contact;
};
