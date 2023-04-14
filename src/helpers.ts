export const generateUniqueID = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return characters
    .split('')
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('')
}
