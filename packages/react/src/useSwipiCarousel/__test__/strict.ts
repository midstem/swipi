import { version } from 'react'

const REACT_MAJOR = Number(version.split('.')[0])

export const REF_ATTACHES_PER_STRICT_MOUNT = REACT_MAJOR >= 19 ? 2 : 1

export const perStrictAttach = <Event>(cycle: Event[]): Event[] =>
  Array.from({ length: REF_ATTACHES_PER_STRICT_MOUNT }, () => cycle).flat()
