import { createApp, h } from 'vue'
import { useSwipiCarousel } from '@midstem/swipi-vue'
import type { SwipiCarousel, SwipiCarouselOptions } from '@midstem/swipi-vue'

const options: SwipiCarouselOptions = { loop: true }

const describe = (carousel?: SwipiCarousel): number =>
  carousel?.slidesCount ?? 0

const Page = {
  render: () =>
    h(
      'p',
      `a page that never calls the composable: ${Object.keys(options).length} option, ${describe()} slides`
    )
}

createApp(Page).mount('#root')
