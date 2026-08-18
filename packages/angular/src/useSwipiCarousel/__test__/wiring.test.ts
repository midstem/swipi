import { afterEach, describe, expect, it } from 'vitest'
import { effect, ElementRef, PLATFORM_ID, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { useSwipiCarousel } from '..'
import { SwipiCarouselTarget } from '../types'
import { buildSlides, getTrack } from './dom'

const SLIDE_WIDTH = 300

const buildViewport = (): HTMLElement => {
  const host = document.createElement('div')
  const viewport = document.createElement('div')
  const track = document.createElement('div')

  viewport.setAttribute('data-testid', 'viewport')
  track.setAttribute('data-testid', 'track')

  buildSlides(track, 4)
  viewport.appendChild(track)
  host.appendChild(viewport)
  document.body.appendChild(host)

  return viewport
}

afterEach(() => {
  document.body.replaceChildren()
  TestBed.resetTestingModule()
})

describe('useSwipiCarousel wiring', () => {
  it('takes the ref from inside an effect the consumer owns', () => {
    const viewport = signal<SwipiCarouselTarget>(undefined)

    const carousel = TestBed.runInInjectionContext(() => {
      const [carouselRef, state] = useSwipiCarousel({
        slideWidth: SLIDE_WIDTH
      })

      effect(() => carouselRef(viewport()))

      return state
    })

    TestBed.tick()

    expect(carousel().slidesCount).toBe(0)

    viewport.set(new ElementRef(buildViewport()))
    TestBed.tick()

    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe(
      '300px'
    )
    expect(carousel().slidesCount).toBe(4)
    expect(carousel().snapCount).toBe(2)
  })

  it('does not make the consumer effect follow the carousel signal', () => {
    const viewport = signal<SwipiCarouselTarget>(
      new ElementRef(buildViewport())
    )
    let runs = 0

    const carousel = TestBed.runInInjectionContext(() => {
      const [carouselRef, state] = useSwipiCarousel({
        slideWidth: SLIDE_WIDTH
      })

      effect(() => {
        runs += 1
        carouselRef(viewport())
      })

      return state
    })

    TestBed.tick()

    expect(runs).toBe(1)

    carousel().scrollNext()
    TestBed.tick()

    expect(carousel().selectedIndex).toBe(1)
    expect(runs).toBe(1)
  })

  it('never measures the element it is handed off the browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
    })

    const viewport = buildViewport()

    const carousel = TestBed.runInInjectionContext(() => {
      const [carouselRef, state] = useSwipiCarousel({
        slideWidth: SLIDE_WIDTH
      })

      carouselRef(viewport)

      return state
    })

    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe('')
    expect(carousel().slidesCount).toBe(0)
    expect(carousel().snapCount).toBe(0)
  })

  it('follows an options signal read inside the consumer template', () => {
    const options = signal({ slideWidth: SLIDE_WIDTH })

    const carousel = TestBed.runInInjectionContext(() => {
      const [carouselRef, state] = useSwipiCarousel(options)

      carouselRef(buildViewport())

      return state
    })

    expect(carousel().snapCount).toBe(2)

    options.set({ slideWidth: 100 })
    TestBed.tick()

    expect(carousel().snapCount).toBe(1)
  })
})
