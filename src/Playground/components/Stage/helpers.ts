import { ConfigService } from '../../../Swipi/configService'
import { ConfigType } from '../../../Swipi/types'
import { PlaygroundState } from '../../types'

export const getConfig = (state: PlaygroundState): ConfigType[] =>
  state.useConfig ? state.config : []

export const getActiveBreakpoint = (
  config: ConfigType[],
  windowWidth: number
): ConfigType | undefined =>
  config.filter((item) => item.maxWidth >= windowWidth).at(-1)

/** Repeats what the slider does internally, so the stage can explain itself. */
export const getVisibleSlides = (
  state: PlaygroundState,
  config: ConfigType[],
  windowWidth: number
): number =>
  ConfigService(config, windowWidth).getRightSlidesCount(
    state.slidesNumber,
    state.slidesAnimation
  )
