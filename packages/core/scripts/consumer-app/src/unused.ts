import { createSwipi } from '@midstem/swipi'
import type { SwipiApi, SwipiOptions } from '@midstem/swipi'

const options: SwipiOptions = { loop: true }

const describe = (carousel?: SwipiApi): number =>
  carousel?.getSnapshot().slidesCount ?? 0

const page = document.createElement('p')

page.textContent = `a page that never calls the engine: ${Object.keys(options).length} option, ${describe()} slides`

document.querySelector('#root')?.append(page)
