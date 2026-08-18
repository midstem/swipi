import { useSwipiCarousel } from '@midstem/swipi-svelte'
import type { SwipiCarousel, SwipiCarouselOptions } from '@midstem/swipi-svelte'

const options: SwipiCarouselOptions = { loop: true }

const describe = (carousel?: SwipiCarousel): number =>
  carousel?.slidesCount ?? 0

const page = document.createElement('p')

page.textContent = `a page that never calls the action: ${Object.keys(options).length} option, ${describe()} slides`

document.getElementById('root')?.appendChild(page)
