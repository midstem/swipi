import { afterEach, describe, expect, it } from 'vitest'
import { DEFAULT_STATE, STORAGE_KEY } from '@swipi/playground-core'
import type { PlaygroundState } from '@swipi/playground-core'
import { createApp } from './app'
import { element } from './dom'

const mount = (state: Partial<PlaygroundState> = {}): HTMLElement => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...DEFAULT_STATE, ...state })
  )

  const root = element('div')

  document.body.append(root)
  createApp(root)

  return root
}

const getButton = (root: HTMLElement, label: string): HTMLButtonElement => {
  const button = Array.from(
    root.querySelectorAll<HTMLButtonElement>('.pg-button')
  ).find((node) => node.textContent === label)

  if (!button) throw new Error(`no "${label}" button on the page`)

  return button
}

const getNumberInput = (root: HTMLElement, label: string): HTMLInputElement => {
  const field = Array.from(root.querySelectorAll<HTMLElement>('.pg-label'))
    .find((node) => node.textContent?.trim() === label)
    ?.closest('.pg-field')

  const input = field?.querySelector<HTMLInputElement>('input[type="number"]')

  if (!input) throw new Error(`"${label}" has no number input`)

  return input
}

const setNumber = (input: HTMLInputElement, value: number): void => {
  input.value = String(value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

const getSlides = (root: HTMLElement): Element[] =>
  Array.from(root.querySelectorAll('.pg-carousel__slide'))

afterEach(() => {
  document.body.replaceChildren()
  window.localStorage.clear()
})

describe('the playground on the page', () => {
  it('draws the carousel the stored state asks for', () => {
    const root = mount({ slidesCount: 4 })

    expect(root.querySelectorAll('.pg-carousel')).toHaveLength(1)
    expect(getSlides(root)).toHaveLength(4)
  })

  it('rebuilds the track once the playground asks for more slides', () => {
    const root = mount({ slidesCount: 4 })

    setNumber(getNumberInput(root, 'Slides in the playground'), 6)

    expect(getSlides(root)).toHaveLength(6)
  })

  it('replaces the carousel on a remount instead of stacking another one', () => {
    const root = mount()
    const before = root.querySelector('.pg-carousel__viewport')

    getButton(root, 'Remount').click()

    const after = root.querySelector('.pg-carousel__viewport')

    expect(root.querySelectorAll('.pg-carousel')).toHaveLength(1)
    expect(after).not.toBe(before)
  })

  it('remounts the carousel a new startIndex needs on mount', () => {
    const root = mount()
    const before = root.querySelector('.pg-carousel__viewport')

    setNumber(getNumberInput(root, 'startIndex'), 2)

    expect(root.querySelectorAll('.pg-carousel')).toHaveLength(1)
    expect(root.querySelector('.pg-carousel__viewport')).not.toBe(before)
  })

  it('puts the defaults back on reset', () => {
    const root = mount({ slidesCount: 4, stageWidth: 320 })

    getButton(root, 'Reset props').click()

    expect(getSlides(root)).toHaveLength(DEFAULT_STATE.slidesCount)
    expect(getNumberInput(root, 'Stage width').value).toBe(
      String(DEFAULT_STATE.stageWidth)
    )
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    ).toEqual(DEFAULT_STATE)
  })
})
