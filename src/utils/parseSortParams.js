export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const parseSortBy = (value) => {
  const keys = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  return keys.includes(value) ? value : '_id';
};

const parseSortOrder = (value) => {
  return String(value).toLowerCase() === SORT_ORDER.DESC
    ? SORT_ORDER.DESC
    : SORT_ORDER.ASC;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
