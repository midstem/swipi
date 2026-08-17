import { FIRST_PRERELEASE } from './constants.mjs'
import { formatVersion, nextPrerelease, parseVersion } from './helpers.mjs'

export const isVersion = (version) => Boolean(parseVersion(version))

export const isPrerelease = (version) =>
  Boolean(parseVersion(version)?.prerelease)

export const suggestVersions = (version) => {
  const current = parseVersion(version)

  if (!current) return []

  const { major, minor, patch, prerelease } = current

  return [
    {
      label: prerelease ? 'stable' : 'patch',
      version: formatVersion({
        major,
        minor,
        patch: prerelease ? patch : patch + 1
      })
    },
    {
      label: 'minor',
      version: formatVersion({ major, minor: minor + 1, patch: 0 })
    },
    {
      label: 'major',
      version: formatVersion({ major: major + 1, minor: 0, patch: 0 })
    },
    {
      label: 'prerelease',
      version: prerelease
        ? formatVersion({
            major,
            minor,
            patch,
            prerelease: nextPrerelease(prerelease)
          })
        : formatVersion({
            major,
            minor,
            patch: patch + 1,
            prerelease: FIRST_PRERELEASE
          })
    }
  ]
}
