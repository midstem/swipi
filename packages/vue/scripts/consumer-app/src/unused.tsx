import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useSwipiCarousel } from 'swipi'
import type { SwipiCarousel, SwipiCarouselOptions } from 'swipi'

const options: SwipiCarouselOptions = { loop: true }

const describe = (carousel?: SwipiCarousel): number =>
  carousel?.slidesCount ?? 0

const Page = () => (
  <p>
    a page that never calls the hook: {Object.keys(options).length} option,{' '}
    {describe()} slides
  </p>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>
)
