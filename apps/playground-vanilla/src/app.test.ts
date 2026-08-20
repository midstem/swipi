import { afterEach, describe, expect, it } from 'vitest'
import { DEFAULT_STATE } from '@swipi/playground-core'
import { createApp } from './app'
import { element } from './dom'

const mount = (): HTMLElement => {
  const root = element('div')

  document.body.append(root)
  createApp(root)

  return root
}

const getButton = (root: HTMLElement, label: string): HTMLButtonElement => {
  const button = Array.from(
    root.querySelectorAll<HTMLButtonElement>('button')
  ).find((node) => node.textContent === label)

  if (!button) throw new Error(`no "${label}" button on the page`)

  return button
}

const getNumberInput = (root: HTMLElement, label: string): HTMLInputElement => {
  const field = Array.from(
    root.querySelectorAll<HTMLElement>('[data-pg="label"]')
  )
    .find((node) => node.textContent?.trim() === label)
    ?.closest('[data-pg="field"]')

  const input = field?.querySelector<HTMLInputElement>('input[type="number"]')

  if (!input) throw new Error(`"${label}" has no number input`)

  return input
}

const setNumber = (input: HTMLInputElement, value: number): void => {
  input.value = String(value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

const getSlides = (root: HTMLElement): Element[] =>
  Array.from(root.querySelectorAll('[data-pg="slide"]'))

afterEach(() => document.body.replaceChildren())

describe('the playground on the page', () => {
  it('draws the carousel the default state asks for', () => {
    const root = mount()

    expect(root.querySelectorAll('[data-pg="carousel"]')).toHaveLength(1)
    expect(getSlides(root)).toHaveLength(DEFAULT_STATE.slidesCount)
  })

  it('rebuilds the track once the playground asks for more slides', () => {
    const root = mount()

    setNumber(getNumberInput(root, 'Slides in the playground'), 6)

    expect(getSlides(root)).toHaveLength(6)
  })

  it('replaces the carousel on a remount instead of stacking another one', () => {
    const root = mount()
    const before = root.querySelector('[data-pg="viewport"]')

    getButton(root, 'Remount').click()

    const after = root.querySelector('[data-pg="viewport"]')

    expect(root.querySelectorAll('[data-pg="carousel"]')).toHaveLength(1)
    expect(after).not.toBe(before)
  })

  it('remounts the carousel a new startIndex needs on mount', () => {
    const root = mount()
    const before = root.querySelector('[data-pg="viewport"]')

    setNumber(getNumberInput(root, 'startIndex'), 2)

    expect(root.querySelectorAll('[data-pg="carousel"]')).toHaveLength(1)
    expect(root.querySelector('[data-pg="viewport"]')).not.toBe(before)
  })

  it('puts the defaults back on reset', () => {
    const root = mount()

    setNumber(getNumberInput(root, 'Slides in the playground'), 4)
    setNumber(getNumberInput(root, 'Stage width'), 320)

    getButton(root, 'Reset props').click()

    expect(getSlides(root)).toHaveLength(DEFAULT_STATE.slidesCount)
    expect(getNumberInput(root, 'Stage width').value).toBe(
      String(DEFAULT_STATE.stageWidth)
    )
  })
})
