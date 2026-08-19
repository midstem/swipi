import { afterEach, describe, expect, it, vi } from 'vitest'
import { inputBinding } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { DEFAULT_STATE, HOOK_OPTIONS } from '@swipi/playground-core'
import type { PlaygroundState } from '@swipi/playground-core'
import { ControlsPanel } from './index'

afterEach(() => TestBed.resetTestingModule())

const renderPanel = (state: Partial<PlaygroundState> = {}): HTMLElement => {
  const fixture = TestBed.createComponent(ControlsPanel, {
    bindings: [
      inputBinding('state', () => ({ ...DEFAULT_STATE, ...state })),
      inputBinding('update', () => vi.fn())
    ]
  })

  fixture.detectChanges()

  return fixture.nativeElement as HTMLElement
}

const getControl = (root: HTMLElement, label: string): HTMLElement => {
  const controls = Array.from(
    root.querySelectorAll<HTMLElement>('.pg-label')
  ).filter(
    (node) => node.textContent?.trim() === label && !node.closest('.pg-config')
  )

  if (controls.length !== 1) {
    throw new Error(`expected one "${label}" control, found ${controls.length}`)
  }

  return controls[0]
}

const getInput = (root: HTMLElement, label: string): HTMLInputElement => {
  const field = getControl(root, label).closest('.pg-field, .pg-toggle')
  const input = field?.querySelector<HTMLInputElement>(
    'input[type="number"], input[type="checkbox"]'
  )

  if (!input) throw new Error(`"${label}" has no input of its own`)

  return input
}

const getSection = (root: HTMLElement, label: string): HTMLElement => {
  const section = getControl(root, label).closest('.pg-section')

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
    expect(getControl(renderPanel(), option)).toBeDefined()
  })

  it.each(HOOK_OPTION_KEYS)('marks %s as an option of the hook', (option) => {
    const section = getSection(renderPanel(), option)

    expect(section.className).toContain('pg-section--hook')
    expect(section.textContent).toContain('hook option')
  })

  it.each(PLAYGROUND_ONLY)('marks %s as drawn by the playground', (control) => {
    const section = getSection(renderPanel(), control)

    expect(section.className).toContain('pg-section--playground')
    expect(section.textContent).toContain('playground only')
  })

  it('puts every hook option in the section it is registered under', () => {
    const root = renderPanel()

    Object.entries(HOOK_OPTIONS).forEach(([option, section]) => {
      expect(getSection(root, option).textContent).toContain(section)
    })
  })
})

describe('the controls a fixed slideWidth takes over', () => {
  it('leaves slidesNumber and biasRight editable without one', () => {
    const root = renderPanel({ slideWidth: 0 })

    expect(getInput(root, 'slidesNumber').disabled).toBe(false)
    expect(getInput(root, 'biasRight').disabled).toBe(false)
  })

  it('disables both once a slide width is set', () => {
    const root = renderPanel({ slideWidth: 240 })

    expect(getInput(root, 'slidesNumber').disabled).toBe(true)
    expect(getInput(root, 'biasRight').disabled).toBe(true)
  })
})
