import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const DOCS = ['LICENSE']

DOCS.forEach((file) => copyFileSync(resolve(ROOT, file), resolve(file)))

console.error(`copied ${DOCS.join(' and ')} from the repository root`)
