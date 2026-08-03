import { CarouselLabels } from './types'

export const DEFAULT_LABELS: CarouselLabels = {
  carousel: 'Slides',
  slide: (index, total) => `${index} of ${total}`,
  dot: (index) => `Go to slide ${index}`,
  announcement: (index, total) => `Slide ${index} of ${total}`
}
