import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

import { ABORT_CODE, CONFIRMATIONS } from './constants.mjs'

export const isCancelled = (error) => error?.code === ABORT_CODE

export const openPrompt = () => {
  const rl = createInterface({ input: stdin, output: stdout })

  const ask = async (question) => (await rl.question(question)).trim()

  const choose = async (rows) => {
    console.log(
      rows.map(({ label }, index) => `  ${index + 1}  ${label}`).join('\n')
    )

    while (true) {
      const answer = await ask(`\nPick 1-${rows.length}: `)
      const row = rows[Number(answer) - 1]

      if (row) return row.value

      console.log(`"${answer}" is not one of them.`)
    }
  }

  const confirm = async (question) =>
    CONFIRMATIONS.includes((await ask(question)).toLowerCase())

  const close = () => {
    rl.close()
    stdin.unref()
  }

  return { ask, choose, confirm, close }
}
