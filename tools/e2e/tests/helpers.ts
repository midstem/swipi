import { Locator, Page, expect } from '@playwright/test'

export const VIEWPORT = '[data-pg="viewport"]'
export const TRACK = '[data-pg="viewport"] > div'
export const LIVE_REGION = '[data-pg="carousel"] [aria-live="polite"]'

export type DragOptions = {
  steps?: number
  stepDelay?: number
  holdBeforeRelease?: number
}

const DEFAULT_DRAG: Required<DragOptions> = {
  steps: 20,
  stepDelay: 16,
  holdBeforeRelease: 150
}

export const openPlayground = async (page: Page): Promise<Locator> => {
  await page.goto('/')

  const viewport = page.locator(VIEWPORT)
  await expect(viewport).toBeVisible()
  await expect(page.locator(LIVE_REGION)).toHaveText('Slide 1 of 5')

  return viewport
}

export const getTranslate = async (page: Page): Promise<number> =>
  page.locator(TRACK).evaluate((track) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform)
    return matrix.m41
  })

export const getSlideIndex = async (page: Page): Promise<number> => {
  const text = await page.locator(LIVE_REGION).innerText()
  const match = text.match(/Slide (\d+) of/)

  return match ? Number(match[1]) : Number.NaN
}

export const dragBy = async (
  page: Page,
  viewport: Locator,
  deltaX: number,
  options: DragOptions = {}
): Promise<number[]> => {
  const { steps, stepDelay, holdBeforeRelease } = {
    ...DEFAULT_DRAG,
    ...options
  }
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  const samples: number[] = []

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(startX + (deltaX * step) / steps, startY)
    await page.waitForTimeout(stepDelay)
    samples.push(await getTranslate(page))
  }

  await page.waitForTimeout(holdBeforeRelease)
  await page.mouse.up()

  return samples
}

export const settle = async (page: Page): Promise<void> => {
  await page.waitForTimeout(600)
}

export const toggleOption = async (
  page: Page,
  label: string
): Promise<void> => {
  await page
    .locator(
      `[data-pg="toggle"]:has([data-pg="label"]:text-is("${label}")) input`
    )
    .click()
}

export const setAxis = async (page: Page, axis: 'x' | 'y'): Promise<void> => {
  await page
    .locator('[data-pg="field"]:has([data-pg="label"]:text-is("axis")) select')
    .selectOption(axis)
}

export const dragAlong = async (
  page: Page,
  viewport: Locator,
  deltaX: number,
  deltaY: number,
  options: DragOptions = {}
): Promise<void> => {
  const { steps, stepDelay, holdBeforeRelease } = {
    ...DEFAULT_DRAG,
    ...options
  }
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(
      startX + (deltaX * step) / steps,
      startY + (deltaY * step) / steps
    )
    await page.waitForTimeout(stepDelay)
  }

  await page.waitForTimeout(holdBeforeRelease)
  await page.mouse.up()
}
