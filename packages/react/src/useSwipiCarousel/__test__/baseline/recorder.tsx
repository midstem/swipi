import { StrictMode, type JSX } from 'react'
import { render } from '@testing-library/react'
import { useSwipiCarousel } from '../..'
import { SwipiCarousel, SwipiCarouselOptions } from '../../types'
import { SlidePositions, SwipiState } from '../../../Swipi/types'
import { SLIDE_WIDTH, SLIDES_COUNT } from '../dom'

export type BaselineProps = SwipiCarouselOptions & {
  count?: number
  onRender?: (carousel: SwipiCarousel) => void
}

export type Baseline = {
  events: string[]
  carousel: () => SwipiCarousel
  rerender: (next: BaselineProps) => void
}

const formatChange = ({ prev, current, next }: SlidePositions): string =>
  `change prev=${prev} current=${current} next=${next}`

const formatSelect = ({
  selectedIndex,
  snapCount,
  canScrollPrev,
  canScrollNext
}: SwipiState): string =>
  `select index=${selectedIndex} snaps=${snapCount} canPrev=${canScrollPrev} canNext=${canScrollNext}`

const Carousel = ({
  count = SLIDES_COUNT,
  onRender,
  ...options
}: BaselineProps): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel({
    slideWidth: SLIDE_WIDTH,
    ...options
  })

  onRender?.(carousel)

  return (
    <div data-testid="viewport" ref={carouselRef}>
      <div data-testid="track">
        {Array.from({ length: count }, (_, index) => (
          <article key={index}>{index + 1}</article>
        ))}
      </div>
    </div>
  )
}

export const renderBaseline = (
  props: BaselineProps = {},
  strict = false
): Baseline => {
  const events: string[] = []
  const latest: { current: SwipiCarousel | null } = { current: null }

  const element = (values: BaselineProps): JSX.Element => {
    const carousel = (
      <Carousel
        {...values}
        onChange={(positions) => events.push(formatChange(positions))}
        onSelect={(state) => events.push(formatSelect(state))}
        onRender={(value) => {
          latest.current = value
        }}
      />
    )

    return strict ? <StrictMode>{carousel}</StrictMode> : carousel
  }

  const view = render(element(props))

  return {
    events,
    carousel: () => latest.current as SwipiCarousel,
    rerender: (next) => view.rerender(element({ ...props, ...next }))
  }
}
