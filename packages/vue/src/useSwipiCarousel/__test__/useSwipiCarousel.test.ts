import { describe, it, expect } from 'vitest'
import { useSwipiCarousel } from '..'

describe('useSwipiCarousel', () => {
  it('should return a function ref and a reactive state', () => {
    const [carouselRef, carousel] = useSwipiCarousel()
    expect(typeof carouselRef).toBe('function')
    expect(carousel.selectedIndex).toBe(0)
    expect(carousel.slidesCount).toBe(0)
  })
})
