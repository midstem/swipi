import { describe, expect, test } from 'vitest'
import { ConfigService } from '.'

const config = [
  { maxWidth: 600, slidesNumber: 1, spaceBetween: 10 },
  { maxWidth: 900, slidesNumber: 2, spaceBetween: 20 },
  { maxWidth: 1200, slidesNumber: 3, spaceBetween: 30 }
]

describe('ConfigService when we have maxWidth >= windowWidth', () => {
  const { getSwipiUpdatesParam, returnCountSlides, returnSpaceBetween } =
    ConfigService(config, 1000)

  test('getSwipiUpdatesParam', () => {
    expect(getSwipiUpdatesParam('slidesNumber')).toBe(3)
    expect(getSwipiUpdatesParam('spaceBetween')).toBe(30)
  })

  test('returnCountSlides', () => {
    expect(returnCountSlides(4)).toBe(3)
    expect(returnCountSlides(6)).toBe(3)
  })

  test('returnSpaceBetween', () => {
    expect(returnSpaceBetween(40)).toBe(30)
    expect(returnSpaceBetween(70)).toBe(30)
  })
})

describe("ConfigService when we don't have maxWidth >= windowWidth", () => {
  const { getSwipiUpdatesParam, returnCountSlides, returnSpaceBetween } =
    ConfigService(config, 1300)

  test('getSwipiUpdatesParam', () => {
    expect(getSwipiUpdatesParam('slidesNumber')).toBe(undefined)
    expect(getSwipiUpdatesParam('spaceBetween')).toBe(undefined)
  })

  test('returnCountSlides', () => {
    expect(returnCountSlides(4)).toBe(4)
    expect(returnCountSlides(6)).toBe(6)
  })

  test('returnSpaceBetween', () => {
    expect(returnSpaceBetween(40)).toBe(40)
    expect(returnSpaceBetween(70)).toBe(70)
  })
})
