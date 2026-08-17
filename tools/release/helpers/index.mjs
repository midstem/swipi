import { DRY_RUN_ENV, DRY_RUN_FLAG } from '../constants.mjs'

export const firstLine = (output) => output.split('\n')[0]

export const pad = (value, width) => String(value).padEnd(width, ' ')

export const isDryRun = () =>
  process.argv.includes(DRY_RUN_FLAG) ||
  process.env[DRY_RUN_ENV] === String(true)
