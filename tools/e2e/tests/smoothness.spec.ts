import { Page, test } from '@playwright/test'
import { TRACK, VIEWPORT, openPlayground, settle } from './helpers'

type Frame = { at: number; x: number }

declare global {
  interface Window {
    __swipiFrames?: Frame[]
    __swipiStop?: () => void
    __swipiMoves?: number[]
  }
}

const startRecording = async (page: Page): Promise<void> => {
  await page.evaluate(
    ([trackSelector, viewportSelector]) => {
      const track = document.querySelector(trackSelector)
      const viewport = document.querySelector(viewportSelector)

      if (!track || !viewport) return

      const frames: Frame[] = []
      const moves: number[] = []
      let running = true

      window.__swipiFrames = frames
      window.__swipiMoves = moves

      const onMove = (): void => {
        moves.push(performance.now())
      }

      viewport.addEventListener('pointermove', onMove, true)

      const tick = (now: number): void => {
        if (!running) return

        const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform)

        frames.push({ at: now, x: matrix.m41 })
        requestAnimationFrame(tick)
      }

      window.__swipiStop = () => {
        running = false
        viewport.removeEventListener('pointermove', onMove, true)
      }

      requestAnimationFrame(tick)
    },
    [TRACK, VIEWPORT]
  )
}

const summarise = (frames: Frame[]): Record<string, number> => {
  const deltas = frames
    .slice(1)
    .map((frame, index) => frame.at - frames[index].at)
  const sorted = [...deltas].sort((a, b) => a - b)
  const stalled = frames
    .slice(1)
    .filter((frame, index) => frame.x === frames[index].x).length

  return {
    frames: frames.length,
    medianFrameMs: Number(
      (sorted[Math.floor(sorted.length / 2)] ?? 0).toFixed(2)
    ),
    p95FrameMs: Number(
      (sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(2)
    ),
    maxFrameMs: Number(Math.max(...deltas, 0).toFixed(2)),
    longFrames: deltas.filter((delta) => delta > 25).length,
    stalledFrames: stalled
  }
}

test('measures drag and animation smoothness', async ({
  page,
  browserName
}) => {
  const viewport = await openPlayground(page)
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  await startRecording(page)

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= 40; step += 1) {
    await page.mouse.move(startX - step * 9, startY)
    await page.waitForTimeout(8)
  }

  const dragFrames = await page.evaluate(() => [
    ...(window.__swipiFrames ?? [])
  ])

  await page.mouse.up()
  await settle(page)
  await page.evaluate(() => window.__swipiStop?.())

  const allFrames = await page.evaluate(() => [...(window.__swipiFrames ?? [])])
  const moves = await page.evaluate(() => [...(window.__swipiMoves ?? [])])
  const animationFrames = allFrames.slice(dragFrames.length)

  console.log(
    `[${browserName}] drag`,
    JSON.stringify({ ...summarise(dragFrames), pointerMoves: moves.length })
  )
  console.log(
    `[${browserName}] release animation`,
    JSON.stringify(summarise(animationFrames))
  )
})
