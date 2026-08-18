import { useSwipiCarousel } from '@midstem/swipi-angular'
import type {
  SwipiCarousel,
  SwipiCarouselOptions
} from '@midstem/swipi-angular'

const options: SwipiCarouselOptions = { loop: true }

const describe = (carousel?: SwipiCarousel): number =>
  carousel?.slidesCount ?? 0

const page = document.createElement('p')

page.textContent = `a page that never calls the hook: ${Object.keys(options).length} option, ${describe()} slides`

document.body.appendChild(page)
