import { Contacts } from '../models/contact.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  userId,
  filter,
}) => {
  const skip = (page - 1) * perPage;
  const finalFilter = { ...filter, userId };

  const totalItems = await Contacts.countDocuments(finalFilter);

  const contacts = await Promise.all([
    Contacts.find(finalFilter)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    Contacts.countDocuments(),
  ]);

  const paginationData = calculatePaginationData(totalItems, page, perPage);
  return {
    data: contacts,
    ...paginationData,
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
