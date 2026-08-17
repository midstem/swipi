export const step = (title) => console.log(`\n▸ ${title}`)

export const lines = (...content) => console.log(content.join('\n'))

export const fail = (...content) => {
  console.error(['', ...content, ''].join('\n'))
  process.exit(1)
}
