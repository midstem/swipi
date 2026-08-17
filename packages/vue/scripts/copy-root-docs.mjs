import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve('..', '..')

const DOCS = ['LICENSE']

DOCS.forEach((file) => copyFileSync(resolve(ROOT, file), resolve(file)))

console.error(`copied ${DOCS.join(' and ')} from the repository root`)
