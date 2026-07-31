import { CSSProperties } from 'react'
import { ConfigService } from '../../../Swipi/configService'
import { ONE_SLIDE, REDUCE_SLIDE } from '../../../Swipi/constants'
import { isFadeInAnimation } from '../../../Swipi/helpers'
import { ConfigType } from '../../../Swipi/types'
import { PlaygroundState } from '../../types'

const NO_BIAS = 1

const FADE_DURATION = 350

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

export const getSpaceBetween = (
  state: PlaygroundState,
  config: ConfigType[],
  windowWidth: number
): number =>
  ConfigService(config, windowWidth).returnSpaceBetween(
    state.spaceBetweenSlides
  )

export const getBias = (
  state: PlaygroundState,
  config: ConfigType[],
  windowWidth: number,
  visibleSlides: number
): number => {
  if (isFadeInAnimation(state.slidesAnimation)) return NO_BIAS

  const fromBreakpoint = ConfigService(
    config,
    windowWidth
  ).getSwipiUpdatesParam('biasRight')

  const isBiased = fromBreakpoint ?? state.biasRight

  return isBiased ? NO_BIAS - REDUCE_SLIDE / visibleSlides : NO_BIAS
}

export const getTrackStyle = (
  visibleSlides: number,
  spaceBetween: number,
  bias: number
): CSSProperties =>
  ({
    '--pg-visible': visibleSlides,
    '--pg-gap': `${spaceBetween}px`,
    '--pg-bias': bias
  }) as CSSProperties

export const getSlideStyle = (
  state: PlaygroundState,
  color: string,
  isSelected: boolean
): CSSProperties => {
  const background = { backgroundColor: color }

  if (!isFadeInAnimation(state.slidesAnimation)) return background

  return {
    ...background,
    opacity: isSelected ? 1 : 0,
    transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1) 0s`
  }
}
