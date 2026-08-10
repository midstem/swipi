import { describe, expect, test } from 'vitest'
import readme from '../../../../../README.md?raw'
import documentation from '../../../../../DOCUMENTATION.md?raw'
import { buildMarkup, buildStyles } from './helpers'
import { DEFAULT_STATE } from '../../constants'
import { README_PRESET } from './constants'

const REQUIRED_MARKUP = /### (?:\d+\. )?The markup[\s\S]*?```tsx\n([\s\S]*?)```/

const REQUIRED_CSS = /### (?:\d+\. )?Required CSS[\s\S]*?```css\n([\s\S]*?)```/

const readBlock = (source: string, pattern: RegExp, title: string): string => {
  const match = pattern.exec(source)

  if (!match) throw new Error(`No "${title}" block in the docs`)

  return match[1].trim()
}

const preset = { ...DEFAULT_STATE, ...README_PRESET }

const MINIMAL = true

const TAILWIND = true

describe('the markup in the README', () => {
  test('should match the minimal Tailwind variant of the playground', () => {
    expect(readBlock(readme, REQUIRED_MARKUP, 'The markup')).toBe(
      buildMarkup(preset, MINIMAL, TAILWIND)
    )
  })
})

describe('the required CSS in the DOCUMENTATION', () => {
  test('should match the minimal variant of the playground', () => {
    expect(readBlock(documentation, REQUIRED_CSS, 'Required CSS')).toBe(
      buildStyles(preset, MINIMAL)
    )
  })
})
