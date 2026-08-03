import { describe, expect, test } from 'vitest'
import { measureSlides } from '.'

const buildTrack = (widths: number[], slideWidth?: number): HTMLElement => {
  const track = document.createElement('div')

  if (slideWidth) {
    track.style.setProperty('--swipi-slide-width', `${slideWidth}px`)
  }

  widths.forEach((width) => {
    const slide = document.createElement('div')

    if (width) slide.setAttribute('data-test-width', String(width))

    track.appendChild(slide)
  })

  document.body.appendChild(track)

  return track
}

describe('measureSlides', () => {
  test('should read equal widths from the track variable', () => {
    const track = buildTrack([0, 0, 0, 0], 250)

    expect(measureSlides(track)).toEqual({
      positions: [0, 250, 500, 750],
      sizes: [250, 250, 250, 250],
      contentSize: 1000,
      loopSize: 1000
    })
  })

  test('should read uneven widths from the slides themselves', () => {
    const track = buildTrack([200, 500, 100, 400])

    expect(measureSlides(track)).toEqual({
      positions: [0, 200, 700, 800],
      sizes: [200, 500, 100, 400],
      contentSize: 1200,
      loopSize: 1200
    })
  })

  test('should report the total content size', () => {
    const track = buildTrack([200, 500, 100, 400])

    expect(measureSlides(track).contentSize).toBe(1200)
  })

  test('should report nothing for an empty track', () => {
    const track = buildTrack([])

    expect(measureSlides(track)).toEqual({
      positions: [],
      sizes: [],
      contentSize: 0,
      loopSize: 0
    })
  })

  test('should keep widths that fall between two pixels', () => {
    const track = buildTrack([100.5, 100.5, 100.5])

    expect(measureSlides(track)).toEqual({
      positions: [0, 100.5, 201],
      sizes: [100.5, 100.5, 100.5],
      contentSize: 301.5,
      loopSize: 301.5
    })
  })

  test('should ignore the transform the track is rendered with', () => {
    const track = buildTrack([300, 300])

    track.style.transform = 'translate3d(-450px, 0, 0)'

    expect(measureSlides(track).positions).toEqual([0, 300])
  })

  test('should take back the lap a slide is shifted by', () => {
    const track = buildTrack([300, 300, 300])
    const [first] = Array.from(track.children) as HTMLElement[]

    first.style.transform = 'translate3d(900px, 0, 0)'

    const laps = new WeakMap<HTMLElement, number>([[first, 900]])

    expect(measureSlides(track, laps).positions).toEqual([0, 300, 600])
  })

  test('should ignore where the track sits on the page', () => {
    const track = buildTrack([300, 300])
    const spacer = document.createElement('div')

    spacer.setAttribute('data-test-width', '120')
    track.parentElement?.insertBefore(spacer, track)

    expect(measureSlides(track).positions).toEqual([0, 300])
  })
})
