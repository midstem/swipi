import { ConfigService } from '../../../Swipi/configService'
import { ONE_SLIDE } from '../../../Swipi/constants'
import { isFadeInAnimation } from '../../../Swipi/helpers'
import { ConfigType } from '../../../Swipi/types'
import { PlaygroundState } from '../../types'

export const getConfig = (state: PlaygroundState): ConfigType[] =>
  state.useConfig ? state.config : []

export const getActiveBreakpoint = (
  config: ConfigType[],
  windowWidth: number
): ConfigType | undefined =>
  config.filter((item) => item.maxWidth >= windowWidth).at(-1)

export const getVisibleSlides = (
  state: PlaygroundState,
  config: ConfigType[],
  windowWidth: number
): number => {
  if (isFadeInAnimation(state.slidesAnimation)) return ONE_SLIDE

  return ConfigService(config, windowWidth).returnCountSlides(
    state.slidesNumber
  )
}
