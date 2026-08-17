import { createApp, h } from 'vue'
import { useSwipiCarousel } from 'swipi-vue'
import type { SwipiCarousel, SwipiCarouselOptions } from 'swipi-vue'

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
