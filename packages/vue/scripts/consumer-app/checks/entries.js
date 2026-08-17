import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const expectedVersion = process.argv[2]

const EXPECTED_EXPORTS = ['useSwipiCarousel']

const esm = await import('swipi-vue')

assert.equal(
  typeof esm.useSwipiCarousel,
  'function',
  'the ESM entry does not export useSwipiCarousel'
)

assert.deepEqual(
  Object.keys(esm)
    .filter((name) => name !== 'default')
    .sort(),
  EXPECTED_EXPORTS,
  `the ESM entry exports more than ${EXPECTED_EXPORTS.join(', ')} at runtime`
)

const cjs = require('swipi-vue')

assert.equal(
  typeof cjs.useSwipiCarousel,
  'function',
  'the CJS entry does not export useSwipiCarousel'
)

assert.deepEqual(
  Object.keys(cjs).sort(),
  EXPECTED_EXPORTS,
  `the CJS entry exports more than ${EXPECTED_EXPORTS.join(', ')} at runtime`
)

const manifest = require('swipi-vue/package.json')

assert.equal(
  manifest.version,
  expectedVersion,
  `the installed package is ${manifest.version}, not ${expectedVersion}`
)

assert.equal(manifest.sideEffects, false, 'the package is not side-effect free')

assert.equal(
  manifest.dependencies,
  undefined,
  'the package declares dependencies, but @swipi/core is not published'
)

console.log(
  `entries: ESM and CJS both expose useSwipiCarousel (${manifest.version})`
)
