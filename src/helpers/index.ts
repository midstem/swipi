export const generateUniqueID = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return characters
    .split('')
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('')
}
export const cloneArray = <T extends Object>(
  array: T[],
  count: number
): T[] => {
  return new Array(count).fill(array).flat() as T[]
}

export const generateArray = (count: number): string[] => {
  return Array.from({ length: count }, () => '')
}

export const returnTimeDifference = (
  firstDate: Date,
  secondDate: Date
): number => {
  return Math.abs(firstDate.getTime() - secondDate.getTime())
}
