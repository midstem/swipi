import { FIRST_PRERELEASE, VERSION_PATTERN } from './constants.mjs'

export const parseVersion = (version) => {
  const match = VERSION_PATTERN.exec(version)

  if (!match) return null

  const [, major, minor, patch, prerelease] = match

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ?? null
  }
}

export const formatVersion = ({ major, minor, patch, prerelease }) =>
  `${major}.${minor}.${patch}${prerelease ? `-${prerelease}` : ''}`

export const nextPrerelease = (prerelease) => {
  const match = /^(.*?)(\d+)$/.exec(prerelease ?? '')

  return match ? `${match[1]}${Number(match[2]) + 1}` : FIRST_PRERELEASE
}
