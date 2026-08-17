import { LOCKFILE } from '../../constants.mjs'
import { fail } from '../log/index.mjs'
import { capture } from '../shell/index.mjs'

import { hasLockVersion, writeLockVersion } from './helpers.mjs'

export const writeVersion = ({ name, location }, version) => {
  if (!hasLockVersion(location)) {
    fail(
      `${LOCKFILE} carries no version for "${location}".`,
      'Run npm install, commit the lockfile, and try again.'
    )
  }

  capture('npm', ['pkg', 'set', `version=${version}`, '--workspace', name])
  writeLockVersion(location, version)
}
