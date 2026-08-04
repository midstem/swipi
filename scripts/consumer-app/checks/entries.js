import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const expectedVersion = process.argv[2]

const esm = await import('swipi')

assert.equal(
  typeof esm.useSwipiCarousel,
  'function',
  'the ESM entry does not export useSwipiCarousel'
)

assert.deepEqual(
  Object.keys(esm).filter((name) => name !== 'default'),
  ['useSwipiCarousel'],
  'the ESM entry exports more than useSwipiCarousel at runtime'
)

const cjs = require('swipi')

assert.equal(
  typeof cjs.useSwipiCarousel,
  'function',
  'the CJS entry does not export useSwipiCarousel'
)

assert.deepEqual(
  Object.keys(cjs),
  ['useSwipiCarousel'],
  'the CJS entry exports more than useSwipiCarousel at runtime'
)

const manifest = require('swipi/package.json')

assert.equal(
  manifest.version,
  expectedVersion,
  `the installed package is ${manifest.version}, not ${expectedVersion}`
)

assert.equal(manifest.sideEffects, false, 'the package is not side-effect free')

console.log(
  `entries: ESM and CJS both expose useSwipiCarousel (${manifest.version})`
)
