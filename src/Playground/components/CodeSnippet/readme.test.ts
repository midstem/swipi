import { describe, expect, test } from 'vitest'
import readme from '../../../../README.md?raw'
import { buildStyles } from './helpers'
import { DEFAULT_STATE } from '../../constants'
import { README_PRESET } from './constants'

const REQUIRED_CSS = /### Required CSS[\s\S]*?```css\n([\s\S]*?)```/

const readRequiredCss = (): string => {
  const match = REQUIRED_CSS.exec(readme)

  if (!match) throw new Error('README has no "Required CSS" block')

  return match[1].trim()
}

describe('the required CSS in the README', () => {
  test('should match what the playground generates', () => {
    expect(readRequiredCss()).toBe(
      buildStyles({ ...DEFAULT_STATE, ...README_PRESET })
    )
  })
})
