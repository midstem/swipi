import { expect, test } from '@playwright/test'
import {
  dragBy,
  getSlideIndex,
  getTranslate,
  openPlayground,
  settle
} from './helpers'

const DRAG_RATIO = 0.6
const SHORT_DRAG_RATIO = 0.2

test.describe('pointer drag', () => {
  test('follows the pointer while dragging', async ({ page }) => {
    const viewport = await openPlayground(page)
    const box = await viewport.boundingBox()

    if (!box) throw new Error('viewport has no box')

    const start = await getTranslate(page)
    const samples = await dragBy(page, viewport, -box.width * DRAG_RATIO)
    const moved = samples.filter((value) => Math.abs(value - start) > 1)

    expect(moved.length).toBeGreaterThan(samples.length / 2)
    expect(samples.at(-1)).toBeLessThan(start - box.width * 0.4)
  })

  test('snaps to the next slide after a long drag', async ({ page }) => {
    const viewport = await openPlayground(page)
    const box = await viewport.boundingBox()

    if (!box) throw new Error('viewport has no box')

    await dragBy(page, viewport, -box.width * DRAG_RATIO)
    await settle(page)

    expect(await getSlideIndex(page)).toBe(2)
  })

  test('snaps back after a short drag', async ({ page }) => {
    const viewport = await openPlayground(page)
    const box = await viewport.boundingBox()

    if (!box) throw new Error('viewport has no box')

    const start = await getTranslate(page)

    await dragBy(page, viewport, -box.width * SHORT_DRAG_RATIO)
    await settle(page)

    expect(await getSlideIndex(page)).toBe(1)
    expect(Math.abs((await getTranslate(page)) - start)).toBeLessThan(2)
  })

  test('drags back to the previous slide', async ({ page }) => {
    const viewport = await openPlayground(page)
    const box = await viewport.boundingBox()

    if (!box) throw new Error('viewport has no box')

    await dragBy(page, viewport, -box.width * DRAG_RATIO)
    await settle(page)
    await dragBy(page, viewport, box.width * DRAG_RATIO)
    await settle(page)

    expect(await getSlideIndex(page)).toBe(1)
  })

  test('keeps dragging after several consecutive drags', async ({ page }) => {
    const viewport = await openPlayground(page)
    const box = await viewport.boundingBox()

    if (!box) throw new Error('viewport has no box')

    for (let index = 0; index < 3; index += 1) {
      await dragBy(page, viewport, -box.width * DRAG_RATIO)
      await settle(page)
    }

    expect(await getSlideIndex(page)).toBe(4)
  })
})
