import { describe, expect, test } from 'vitest'
import readme from '../../../../README.md?raw'
import { buildMarkup, buildStyles } from './helpers'
import { DEFAULT_STATE } from '../../constants'
import { README_PRESET } from './constants'

const REQUIRED_MARKUP = /### The markup[\s\S]*?```tsx\n([\s\S]*?)```/

const REQUIRED_CSS = /### Required CSS[\s\S]*?```css\n([\s\S]*?)```/

const readBlock = (pattern: RegExp, title: string): string => {
  const match = pattern.exec(readme)

  if (!match) throw new Error(`README has no "${title}" block`)

  return match[1].trim()
}

const preset = { ...DEFAULT_STATE, ...README_PRESET }

describe('the markup in the README', () => {
  test('should match what the playground generates', () => {
    expect(readBlock(REQUIRED_MARKUP, 'The markup')).toBe(buildMarkup(preset))
  })
})

describe('the required CSS in the README', () => {
  test('should match what the playground generates', () => {
    expect(readBlock(REQUIRED_CSS, 'Required CSS')).toBe(buildStyles(preset))
  })
})
