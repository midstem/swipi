import { describe, expect, test, vi } from 'vitest'
import { startAutoplay } from '.'
import { TimeoutRef } from './types'

describe('startAutoplay', () => {
  test('should start autoplay', () => {
    vi.useFakeTimers()
    const timeout: TimeoutRef = { current: undefined }
    const nextImg = vi.fn()
    const autoplaySpeed = 3000

    startAutoplay(autoplaySpeed, timeout, nextImg)
    vi.advanceTimersByTime(autoplaySpeed)

    expect(nextImg).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
