import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const expectedVersion = process.argv[2]

const EXPECTED_EXPORTS = ['createSwipi', 'resolveOptions']

const esm = await import('@midstem/swipi')

assert.equal(
  typeof esm.createSwipi,
  'function',
  'the ESM entry does not export createSwipi'
)

assert.equal(
  typeof esm.resolveOptions,
  'function',
  'the ESM entry does not export resolveOptions'
)

assert.deepEqual(
  Object.keys(esm)
    .filter((name) => name !== 'default')
    .sort(),
  EXPECTED_EXPORTS,
  `the ESM entry exports more than ${EXPECTED_EXPORTS.join(', ')} at runtime`
)

const cjs = require('@midstem/swipi')

assert.equal(
  typeof cjs.createSwipi,
  'function',
  'the CJS entry does not export createSwipi'
)

assert.equal(
  typeof cjs.resolveOptions,
  'function',
  'the CJS entry does not export resolveOptions'
)

assert.deepEqual(
  Object.keys(cjs).sort(),
  EXPECTED_EXPORTS,
  `the CJS entry exports more than ${EXPECTED_EXPORTS.join(', ')} at runtime`
)

const manifest = require('@midstem/swipi/package.json')

assert.equal(
  manifest.version,
  expectedVersion,
  `the installed package is ${manifest.version}, not ${expectedVersion}`
)

assert.equal(manifest.sideEffects, false, 'the package is not side-effect free')

assert.equal(
  manifest.dependencies,
  undefined,
  'the package declares dependencies, but the engine stands alone'
)

assert.equal(
  manifest.peerDependencies,
  undefined,
  'the package declares peer dependencies, but the engine needs no framework'
)

console.log(`entries: ESM and CJS both expose the engine (${manifest.version})`)
