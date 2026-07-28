export const generateArray = (count: number): string[] => {
  return Array.from({ length: count }, () => '')
}

export const returnTimeDifference = (
  firstDate: Date,
  secondDate: Date
): number => {
  return Math.abs(firstDate.getTime() - secondDate.getTime())
}
