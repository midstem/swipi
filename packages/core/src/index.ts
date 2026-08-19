import { createSwipi as createSwipiEngine } from './createSwipi'
import { resolveOptions as resolveSwipiOptions } from './createSwipi/options'
import type { ResolvedSwipiOptions, SwipiApi, SwipiOptions } from './types'

export const createSwipi: (
  viewport: HTMLElement,
  options?: SwipiOptions
) => SwipiApi = createSwipiEngine

export const resolveOptions: (options?: SwipiOptions) => ResolvedSwipiOptions =
  resolveSwipiOptions

export type {
  ResolvedSwipiOptions,
  SwipiApi,
  SwipiOptions,
  SwipiSnapshot,
  SwipiState,
  SlidePositions,
  SwipiAxis
} from './types'
