import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ControlsPanel from '.'
import { DEFAULT_STATE, HOOK_OPTIONS } from '@swipi/playground-core'
import { PlaygroundState } from '@swipi/playground-core'

const renderPanel = (state: Partial<PlaygroundState> = {}): void => {
  render(
    <ControlsPanel state={{ ...DEFAULT_STATE, ...state }} update={vi.fn()} />
  )
}

const getControl = (label: string): HTMLElement => {
  const controls = screen
    .getAllByText(label, { selector: '[data-pg="label"]' })
    .filter((node) => !node.closest('[data-pg="config"]'))

  if (controls.length !== 1) {
    throw new Error(`expected one "${label}" control, found ${controls.length}`)
  }

  return controls[0]
}

const getInput = (label: string): HTMLInputElement => {
  const field = getControl(label).closest(
    '[data-pg="field"], [data-pg="toggle"]'
  )
  const input = field?.querySelector<HTMLInputElement>(
    'input[type="number"], input[type="checkbox"]'
  )

  if (!input) throw new Error(`"${label}" has no input of its own`)

  return input
}

const getSection = (label: string): HTMLElement => {
  const section = getControl(label).closest('[data-pg="section"]')

  if (!section) throw new Error(`"${label}" is outside of any section`)

  return section as HTMLElement
}

const HOOK_OPTION_KEYS = Object.keys(HOOK_OPTIONS)

const PLAYGROUND_ONLY = [
  'slidesNumber',
  'biasRight',
  'slidesAnimation',
  'showArrows',
  'showDots',
  'config',
  'ariaLabel'
]

describe('the controls panel against the public API', () => {
  it.each(HOOK_OPTION_KEYS)('reaches %s from the panel', (option) => {
    renderPanel()

    expect(getControl(option)).toBeDefined()
  })

  it.each(HOOK_OPTION_KEYS)('marks %s as an option of the hook', (option) => {
    renderPanel()

    expect(getSection(option).dataset.origin).toBe('hook')
    expect(getSection(option).textContent).toContain('hook option')
  })

  it.each(PLAYGROUND_ONLY)('marks %s as drawn by the playground', (control) => {
    renderPanel()

    expect(getSection(control).dataset.origin).toBe('playground')
    expect(getSection(control).textContent).toContain('playground only')
  })

  it('puts every hook option in the section it is registered under', () => {
    renderPanel()

    Object.entries(HOOK_OPTIONS).forEach(([option, section]) => {
      expect(getSection(option).textContent).toContain(section)
    })
  })
})

describe('the controls a fixed slideWidth takes over', () => {
  it('leaves slidesNumber and biasRight editable without one', () => {
    renderPanel({ slideWidth: 0 })

    expect(getInput('slidesNumber').disabled).toBe(false)
    expect(getInput('biasRight').disabled).toBe(false)
  })

  it('disables both once a slide width is set', () => {
    renderPanel({ slideWidth: 240 })

    expect(getInput('slidesNumber').disabled).toBe(true)
    expect(getInput('biasRight').disabled).toBe(true)
  })
})
