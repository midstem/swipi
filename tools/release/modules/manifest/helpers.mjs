import { readFileSync, writeFileSync } from 'node:fs'

import { LOCKFILE } from '../../constants.mjs'

const lockPattern = (location) =>
  new RegExp(`("${location}":\\s*\\{[^{}]*?"version":\\s*)"[^"]+"`)

export const hasLockVersion = (location) =>
  lockPattern(location).test(readFileSync(LOCKFILE, 'utf8'))

export const writeLockVersion = (location, version) => {
  const source = readFileSync(LOCKFILE, 'utf8')

  writeFileSync(
    LOCKFILE,
    source.replace(lockPattern(location), `$1"${version}"`)
  )
}
