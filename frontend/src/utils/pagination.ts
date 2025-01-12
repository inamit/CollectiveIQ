export const paginate = (array: any[], pageSize: number) => {
  if (!array) return [];
  const pageCount = Math.ceil(array.length / pageSize);
  return Array.from({ length: pageCount }, (_, index) =>
    array.slice(index * pageSize, (index + 1) * pageSize)
  );
};
