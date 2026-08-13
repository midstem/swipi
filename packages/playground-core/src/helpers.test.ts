import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_STATE, STORAGE_KEY } from './constants'
import { loadState, saveState } from './helpers'

const store = (value: unknown): void =>
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))

describe('loadState', () => {
  beforeEach(() => window.localStorage.clear())

  it('falls back to the defaults without anything stored', () => {
    expect(loadState()).toEqual(DEFAULT_STATE)
  })

  it('survives a broken payload', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ not json')

    expect(loadState()).toEqual(DEFAULT_STATE)
  })

  it('keeps the options it recognises', () => {
    store({ ...DEFAULT_STATE, loop: false, spaceBetween: 40 })

    expect(loadState()).toMatchObject({ loop: false, spaceBetween: 40 })
  })

  it('drops an option that no longer exists', () => {
    store({ ...DEFAULT_STATE, spaceBetweenSlides: 40, initialSlide: 3 })

    expect(loadState()).not.toHaveProperty('spaceBetweenSlides')
    expect(loadState()).not.toHaveProperty('initialSlide')
  })

  it('defaults an option the stored state never had', () => {
    const { slideWidth: _, ...withoutSlideWidth } = DEFAULT_STATE

    store(withoutSlideWidth)

    expect(loadState().slideWidth).toBe(DEFAULT_STATE.slideWidth)
  })

  it('defaults an option stored under the wrong type', () => {
    store({ ...DEFAULT_STATE, loop: 'yes', animationSpeed: null })

    expect(loadState().loop).toBe(DEFAULT_STATE.loop)
    expect(loadState().animationSpeed).toBe(DEFAULT_STATE.animationSpeed)
  })

  it('refuses breakpoints the config editor could not render', () => {
    store({ ...DEFAULT_STATE, config: [null, 3, { maxWidth: 600 }] })

    expect(loadState().config).toEqual(DEFAULT_STATE.config)
  })

  it('keeps breakpoints that are whole', () => {
    const config = [{ maxWidth: 600, slidesNumber: 2, spaceBetween: 8 }]

    store({ ...DEFAULT_STATE, config })

    expect(loadState().config).toEqual(config)
  })

  it('refuses an animation that is not on the list', () => {
    store({ ...DEFAULT_STATE, slidesAnimation: 'slide-up' })

    expect(loadState().slidesAnimation).toBe(DEFAULT_STATE.slidesAnimation)
  })
})

describe('saveState', () => {
  beforeEach(() => window.localStorage.clear())

  it('round-trips the state it wrote', () => {
    const state = { ...DEFAULT_STATE, loop: false, slideWidth: 320 }

    saveState(state)

    expect(loadState()).toEqual(state)
  })
})
