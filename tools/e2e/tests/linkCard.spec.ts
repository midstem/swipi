import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Page, expect, test } from '@playwright/test'

const BUNDLE = fileURLToPath(
  new URL('../../../packages/core/dist/index.js', import.meta.url)
)

const ORIGIN = 'https://swipi.fixture'

const PAGE = `<main>
  <a class="card" href="/product/1">
    <div class="media">
      <div class="viewport">
        <div class="track">
          <div class="slide"><img alt="one" src="${'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="380"><rect width="300" height="380" fill="%23c33"/></svg>')}"></div>
          <div class="slide"><img alt="two" src="${'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="380"><rect width="300" height="380" fill="%233c3"/></svg>')}"></div>
          <div class="slide"><img alt="three" src="${'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="380"><rect width="300" height="380" fill="%2333c"/></svg>')}"></div>
        </div>
      </div>
    </div>
    <span class="title">A product that is also a link</span>
  </a>
</main>
<style>
  body { margin: 0; font: 16px system-ui; }
  .card { display: block; width: 300px; text-decoration: none; color: inherit; }
  .media { position: relative; width: 300px; }
  .viewport { overflow: hidden; touch-action: pan-y; }
  .track { display: flex; user-select: none; }
  .slide { flex: 0 0 100%; min-width: 0; }
  .slide img { display: block; width: 100%; }
</style>
<script type="module">
  import { createSwipi } from '/core.js'

  const viewport = document.querySelector('.viewport')

  window.__swipi = createSwipi(viewport, { loop: false })
  window.__ready = true
</script>`

const readBundle = (): string => {
  try {
    return readFileSync(BUNDLE, 'utf8')
  } catch {
    throw new Error(
      'packages/core/dist/index.js is missing — run `npm run build --workspace @midstem/swipi` first'
    )
  }
}

const openFixture = async (page: Page): Promise<void> => {
  const bundle = readBundle()

  await page.route(`${ORIGIN}/core.js`, (route) =>
    route.fulfill({ contentType: 'text/javascript', body: bundle })
  )
  await page.route(`${ORIGIN}/`, (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE })
  )

  await page.goto(`${ORIGIN}/`)
  await page.waitForFunction(() => window.__ready === true)
}

const getTranslate = (page: Page): Promise<number> =>
  page
    .locator('.track')
    .evaluate(
      (track) => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41
    )

declare global {
  interface Window {
    __ready?: boolean
    __dragstart?: { target: string; prevented: boolean }[]
    __cancels?: number
  }
}

test('a carousel nested in a link still drags', async ({
  page,
  browserName
}) => {
  await openFixture(page)

  await page.evaluate(() => {
    const dragstart: { target: string; prevented: boolean }[] = []
    let cancels = 0

    window.__dragstart = dragstart
    window.__cancels = 0

    document.addEventListener('dragstart', (event) => {
      const target = event.target as Element

      dragstart.push({
        target: target.tagName.toLowerCase(),
        prevented: event.defaultPrevented
      })
    })

    document.addEventListener(
      'pointercancel',
      () => {
        cancels += 1
        window.__cancels = cancels
      },
      true
    )
  })

  const viewport = page.locator('.viewport')
  const box = await viewport.boundingBox()

  if (!box) throw new Error('viewport has no box')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let step = 1; step <= 15; step += 1) {
    await page.mouse.move(startX - step * 12, startY)
    await page.waitForTimeout(16)
  }

  await page.waitForTimeout(150)
  await page.mouse.up()
  await page.waitForTimeout(600)

  const dragstart = await page.evaluate(() => window.__dragstart ?? [])
  const cancels = await page.evaluate(() => window.__cancels ?? 0)
  const translate = await getTranslate(page)

  console.log(
    `[${browserName}] link card`,
    JSON.stringify({ dragstart, cancels, translate })
  )

  expect(dragstart.filter((entry) => !entry.prevented)).toEqual([])
  expect(cancels).toBe(0)
  expect(translate).toBeLessThan(-box.width * 0.5)
})
