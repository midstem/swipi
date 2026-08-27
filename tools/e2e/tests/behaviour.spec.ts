import { expect, test } from '@playwright/test'
import {
  LIVE_REGION,
  dragAlong,
  dragBy,
  getSlideIndex,
  getTranslate,
  openPlayground,
  setAxis,
  settle,
  toggleOption
} from './helpers'

const DRAG_RATIO = 0.6

test('loop wraps past the last slide', async ({ page, browserName }) => {
  const viewport = await openPlayground(page)
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const seen: number[] = []

  for (let step = 0; step < 5; step += 1) {
    await dragBy(page, viewport, -box.width * DRAG_RATIO)
    await settle(page)
    seen.push(await getSlideIndex(page))
  }

  console.log(`[${browserName}] loop sequence`, JSON.stringify(seen))
  expect(seen).toEqual([2, 3, 4, 5, 1])
})

test('arrows move the carousel', async ({ page }) => {
  await openPlayground(page)

  await page.getByRole('button', { name: 'Next slide' }).click()
  await settle(page)
  expect(await getSlideIndex(page)).toBe(2)

  await page.getByRole('button', { name: 'Previous slide' }).click()
  await settle(page)
  expect(await getSlideIndex(page)).toBe(1)
})

test('dots jump to a slide', async ({ page }) => {
  await openPlayground(page)

  await page.getByRole('button', { name: 'Go to slide 4' }).click()
  await settle(page)

  expect(await getSlideIndex(page)).toBe(4)
})

test('a drag interrupts a running animation without jumping', async ({
  page,
  browserName
}) => {
  const viewport = await openPlayground(page)
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  await page.getByRole('button', { name: 'Next slide' }).click()
  await page.waitForTimeout(60)

  const grabbed = await getTranslate(page)
  const samples = await dragBy(page, viewport, -box.width * DRAG_RATIO, {
    steps: 12
  })
  const jumps = samples
    .slice(1)
    .map((value, index) => value - samples[index])
    .filter((delta) => Math.abs(delta) > box.width * 0.25)

  await settle(page)

  console.log(`[${browserName}] interrupted`, {
    grabbed,
    first: samples[0],
    index: await getSlideIndex(page)
  })

  expect(jumps).toEqual([])
  expect(await getSlideIndex(page)).toBeGreaterThan(1)
})

test('vertical axis drags along y', async ({ page }) => {
  const viewport = await openPlayground(page)

  await setAxis(page, 'y')
  await settle(page)

  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  await dragAlong(page, viewport, 0, -box.height * DRAG_RATIO)
  await settle(page)

  expect(await getSlideIndex(page)).toBe(2)
})

test('autoplay advances on its own', async ({ page }) => {
  await openPlayground(page)

  await toggleOption(page, 'autoplay')
  await expect(page.locator(LIVE_REGION)).toHaveText('Slide 2 of 5', {
    timeout: 8000
  })
})

test('dragFree rests where the drag stops', async ({ page, browserName }) => {
  const viewport = await openPlayground(page)

  await toggleOption(page, 'dragFree')
  await settle(page)

  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const start = await getTranslate(page)

  await dragBy(page, viewport, -box.width * 0.3)
  await settle(page)

  const distance = start - (await getTranslate(page))

  console.log(`[${browserName}] dragFree distance`, distance)
  expect(distance).toBeGreaterThan(box.width * 0.2)
  expect(distance).toBeLessThan(box.width * 0.45)
})

test('a resize keeps the active slide aligned', async ({
  page,
  browserName
}) => {
  const viewport = await openPlayground(page)
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  await dragBy(page, viewport, -box.width * DRAG_RATIO)
  await settle(page)
  expect(await getSlideIndex(page)).toBe(2)

  await page.setViewportSize({ width: 900, height: 800 })
  await settle(page)

  const nextBox = await viewport.boundingBox()

  if (!nextBox) throw new Error('viewport has no box')

  const translate = await getTranslate(page)

  console.log(`[${browserName}] after resize`, {
    index: await getSlideIndex(page),
    translate,
    width: nextBox.width
  })

  expect(await getSlideIndex(page)).toBe(2)
})
