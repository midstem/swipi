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

    expect(measureSlides(track, 500, false)).toEqual({
      positions: [0, 250, 500, 750],
      sizes: [250, 250, 250, 250],
      contentSize: 1000,
      snaps: [0, -250, -500]
    })
  })

  test('should read uneven widths from the slides themselves', () => {
    const track = buildTrack([200, 500, 100, 400])

    expect(measureSlides(track, 400, false)).toEqual({
      positions: [0, 200, 700, 800],
      sizes: [200, 500, 100, 400],
      contentSize: 1200,
      snaps: [0, -200, -700, -800]
    })
  })

  test('should snap to every slide in loop mode', () => {
    const track = buildTrack([200, 500, 100, 400])

    expect(measureSlides(track, 400, true).snaps).toEqual([0, -200, -700, -800])
  })

  test('should report nothing for an empty track', () => {
    const track = buildTrack([])

    expect(measureSlides(track, 400, false)).toEqual({
      positions: [],
      sizes: [],
      contentSize: 0,
      snaps: []
    })
  })

  test('should ignore where the track sits on the page', () => {
    const track = buildTrack([300, 300])
    const spacer = document.createElement('div')

    spacer.setAttribute('data-test-width', '120')
    track.parentElement?.insertBefore(spacer, track)

    expect(measureSlides(track, 300, false).positions).toEqual([0, 300])
  })
})
