import { expect, test } from '@playwright/test'
import { VIEWPORT, dragBy, getTranslate, openPlayground } from './helpers'

type PointerLog = {
  down: number
  move: number
  up: number
  cancel: number
  lostCapture: number
  selection: number
}

declare global {
  interface Window {
    __swipiLog?: PointerLog
  }
}

test('reports which pointer events the viewport receives', async ({
  page,
  browserName
}) => {
  const viewport = await openPlayground(page)

  await page.evaluate((selector) => {
    const element = document.querySelector(selector)

    if (!element) return

    const log: PointerLog = {
      down: 0,
      move: 0,
      up: 0,
      cancel: 0,
      lostCapture: 0,
      selection: 0
    }

    window.__swipiLog = log

    element.addEventListener('pointerdown', () => (log.down += 1), true)
    element.addEventListener('pointermove', () => (log.move += 1), true)
    document.addEventListener('pointerup', () => (log.up += 1), true)
    document.addEventListener('pointercancel', () => (log.cancel += 1), true)
    element.addEventListener('lostpointercapture', () => (log.lostCapture += 1))
    document.addEventListener('selectionchange', () => (log.selection += 1))
  }, VIEWPORT)

  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const samples = await dragBy(page, viewport, -box.width * 0.6)
  const log = await page.evaluate(() => window.__swipiLog)

  console.log(`[${browserName}] pointer log`, JSON.stringify(log))
  console.log(`[${browserName}] translate samples`, JSON.stringify(samples))
  console.log(`[${browserName}] settled translate`, await getTranslate(page))

  expect(log?.down).toBeGreaterThan(0)
  expect(log?.move).toBeGreaterThan(0)
  expect(log?.up).toBeGreaterThan(0)
  expect(log?.cancel).toBe(0)
})
