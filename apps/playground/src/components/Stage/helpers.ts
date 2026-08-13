import { CSSProperties } from 'react'
import { ConfigService } from '../../configService'
import { NO_SLIDE_WIDTH, ONE_SLIDE, REDUCE_SLIDE } from '../../constants'
import { isFadeInAnimation } from '../../helpers'
import { ConfigType, PlaygroundState } from '../../types'

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
  ConfigService(config, windowWidth).returnSpaceBetween(state.spaceBetween)

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

export const getViewportStyle = (
  state: PlaygroundState,
  isVertical: boolean
): CSSProperties => (isVertical ? { height: state.stageHeight } : {})

export const getArrows = (isVertical: boolean): [string, string] =>
  isVertical ? ['↑', '↓'] : ['‹', '›']

const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp']

const NEXT_KEYS = ['ArrowRight', 'ArrowDown']

export const isPreviousKey = (key: string, isVertical: boolean): boolean =>
  key === PREVIOUS_KEYS[isVertical ? 1 : 0]

export const isNextKey = (key: string, isVertical: boolean): boolean =>
  key === NEXT_KEYS[isVertical ? 1 : 0]

export const getSlideWidth = (state: PlaygroundState): number | undefined =>
  state.slideWidth > NO_SLIDE_WIDTH ? state.slideWidth : undefined

export const getTrackStyle = (
  visibleSlides: number,
  bias: number,
  slideWidth?: number
): CSSProperties =>
  ({
    '--pg-basis':
      slideWidth === undefined
        ? `calc(100% / ${visibleSlides} * ${bias})`
        : 'calc(var(--swipi-slide-width) + var(--swipi-slide-gap, 0px))'
  }) as CSSProperties

export const getSlideStyle = (
  state: PlaygroundState,
  isSelected: boolean
): CSSProperties => {
  if (!isFadeInAnimation(state.slidesAnimation)) return {}

  return {
    opacity: isSelected ? 1 : 0,
    transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1) 0s`
  }
}
