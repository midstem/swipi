export const cloneArray = <T extends Object>(
  array: T[],
  count: number
): T[] => {
  return new Array(count).fill(array).flat() as T[];
};
