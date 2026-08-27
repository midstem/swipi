import { Locator, Page, expect, test } from '@playwright/test'
import { getSlideIndex, getTranslate, openPlayground, settle } from './helpers'

const FLICK_DISTANCE = 120
const FLICK_STEPS = 6

const flick = async (
  page: Page,
  viewport: Locator,
  deltaX: number,
  stepDelay = 0
): Promise<void> => {
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= FLICK_STEPS; step += 1) {
    await page.mouse.move(startX + (deltaX * step) / FLICK_STEPS, startY)
    if (stepDelay) await page.waitForTimeout(stepDelay)
  }

  await page.mouse.up()
}

test('a fast flick advances one slide', async ({ page, browserName }) => {
  const viewport = await openPlayground(page)

  await flick(page, viewport, -FLICK_DISTANCE)
  await settle(page)

  console.log(`[${browserName}] flick index`, await getSlideIndex(page))
  expect(await getSlideIndex(page)).toBe(2)
})

test('a paced flick advances one slide', async ({ page, browserName }) => {
  const viewport = await openPlayground(page)

  await flick(page, viewport, -FLICK_DISTANCE, 16)
  await settle(page)

  console.log(`[${browserName}] paced flick index`, await getSlideIndex(page))
  expect(await getSlideIndex(page)).toBe(2)
})

test('a drag released outside the viewport still snaps', async ({
  page,
  browserName
}) => {
  const viewport = await openPlayground(page)
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= 10; step += 1) {
    await page.mouse.move(startX - step * 40, startY - step * 30)
    await page.waitForTimeout(16)
  }

  await page.waitForTimeout(150)
  await page.mouse.up()
  await settle(page)

  const translate = await getTranslate(page)

  console.log(`[${browserName}] outside release`, {
    index: await getSlideIndex(page),
    translate
  })

  expect(await getSlideIndex(page)).toBe(2)
})

test('a drag that starts on slide content still works', async ({ page }) => {
  const viewport = await openPlayground(page)
  const slide = page.locator('[data-pg="slide"]').first()
  const box = await slide.boundingBox()

  if (!box) throw new Error('slide has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= 20; step += 1) {
    await page.mouse.move(startX - step * 20, startY)
    await page.waitForTimeout(16)
  }

  await page.waitForTimeout(150)
  await page.mouse.up()
  await settle(page)

  const selectedInside = await viewport.evaluate((node) => {
    const selection = getSelection()

    if (!selection || selection.isCollapsed || !selection.anchorNode)
      return false

    return node.contains(selection.anchorNode)
  })

  expect(await getSlideIndex(page)).toBe(2)
  expect(selectedInside).toBe(false)
})
