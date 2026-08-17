import { ResolvedSwipiOptions, SwipiOptions } from '#src/types'

import { DEFAULT_OPTIONS } from './constants'

export const resolveOptions = (
  options: SwipiOptions = {}
): ResolvedSwipiOptions => ({
  axis: options.axis ?? DEFAULT_OPTIONS.axis,
  loop: options.loop ?? DEFAULT_OPTIONS.loop,
  dragFree: options.dragFree ?? DEFAULT_OPTIONS.dragFree,
  autoplay: options.autoplay ?? DEFAULT_OPTIONS.autoplay,
  startIndex: options.startIndex ?? DEFAULT_OPTIONS.startIndex,
  autoplaySpeed: options.autoplaySpeed ?? DEFAULT_OPTIONS.autoplaySpeed,
  animationSpeed: options.animationSpeed ?? DEFAULT_OPTIONS.animationSpeed,
  respectReducedMotion:
    options.respectReducedMotion ?? DEFAULT_OPTIONS.respectReducedMotion,
  slideWidth: options.slideWidth,
  spaceBetween: options.spaceBetween,
  onChange: options.onChange,
  onSelect: options.onSelect
})
