import { GeometryState } from './geometrySync'
import { StoreState } from './store'

export const toStoreState = (state: GeometryState): StoreState => ({
  slideIndex: state.slideIndex,
  snapCount: state.countShowDots,
  slidesCount: state.measurement.sizes.length,
  hasOverflow: state.hasOverflow,
  canScrollNext: state.canScrollNext,
  canScrollPrev: state.canScrollPrev
})
