import { execFileSync } from 'node:child_process'

export const capture = (command, args) =>
  execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()

export const attempt = (command, args) => {
  try {
    return { ok: true, output: capture(command, args) }
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout ?? ''}\n${error.stderr ?? ''}`.trim()
    }
  }
}

export const forward = (command, args) =>
  execFileSync(command, args, { stdio: 'inherit' })
