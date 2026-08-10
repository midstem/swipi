import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { readBuiltEntry } from './environment.js'

const RUNTIME_MARKER = '--swipi-slide-width'

const MINIFIED_LINE_LENGTH = 1000

const readChunks = (directory) => {
  const assets = join(directory, 'assets')

  return readdirSync(assets)
    .filter((file) => file.endsWith('.js'))
    .map((file) => readFileSync(join(assets, file), 'utf8'))
    .join('\n')
}

const app = readFileSync(readBuiltEntry(), 'utf8')

assert.ok(
  app.includes(RUNTIME_MARKER),
  'the built app does not carry the swipi runtime'
)

assert.ok(
  !app.includes('useSwipiCarousel'),
  'the built app still carries unminified swipi identifiers'
)

const lineLength = app.length / app.split('\n').length

assert.ok(
  lineLength > MINIFIED_LINE_LENGTH,
  `the built app is not minified (${Math.round(lineLength)} chars per line)`
)

const unused = readChunks(resolve('dist-unused'))

assert.ok(
  unused.includes('never calls the hook'),
  'the tree-shaking build produced nothing to look at'
)

assert.ok(
  !unused.includes(RUNTIME_MARKER),
  'an import without a call still pulls the swipi runtime in'
)

console.log('prod: minified, and an uncalled import drops the runtime')
