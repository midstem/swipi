import { capture } from '../shell/index.mjs'

export const readPackages = () =>
  JSON.parse(capture('npm', ['query', '.workspace', '--json']))
    .filter((workspace) => !workspace.private)
    .map(({ name, version, location }) => ({ name, version, location }))
    .sort((left, right) => left.name.localeCompare(right.name))
