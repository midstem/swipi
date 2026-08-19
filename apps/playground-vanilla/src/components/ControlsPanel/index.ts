import type { SwipiAxis } from '@midstem/swipi'
import {
  ANIMATION_SPEED_LIMITS,
  AUTOPLAY_SPEED_LIMITS,
  AXIS_OPTIONS,
  MAX_SLIDES_COUNT,
  MIN_SLIDES_COUNT,
  NO_SLIDE_WIDTH,
  ONE_SLIDE,
  SLIDES_ANIMATION_OPTIONS,
  SLIDES_NUMBER_LIMITS,
  SLIDE_WIDTH_LIMITS,
  SPACE_BETWEEN_LIMITS,
  STAGE_HEIGHT_LIMITS,
  STAGE_PRESETS,
  STAGE_WIDTH_LIMITS,
  VERTICAL_AXIS
} from '@swipi/playground-core'
import type {
  ControlsPanelProps,
  PlaygroundState,
  PlaygroundStateKey,
  SlidesAnimation,
  ValueOf
} from '@swipi/playground-core'
import { element } from '../../dom'
import type { Component } from '../../types'
import { createConfigEditor } from '../ConfigEditor'
import { createNumberField } from '../NumberField'
import { createSection } from '../Section'
import { createSelectField } from '../SelectField'
import { createTextField } from '../TextField'
import { createToggle } from '../Toggle'

const VERTICAL_SLIDE_WIDTH_HINT =
  'Fixed slide size along the axis — a height while axis is y. 0 leaves the option off and slidesNumber back in charge'

const SLIDE_WIDTH_HINT =
  'Fixed slide width, px. 0 leaves the option off and slidesNumber back in charge'

export const createControlsPanel = (
  props: ControlsPanelProps
): Component<ControlsPanelProps> => {
  let current = props

  const updates: ((state: PlaygroundState) => void)[] = []

  const change =
    <Key extends PlaygroundStateKey>(key: Key) =>
    (value: PlaygroundState[Key]): void =>
      current.update(key, value)

  const register = <Props>(
    parent: HTMLElement,
    create: (fieldProps: Props) => Component<Props>,
    build: (state: PlaygroundState) => Props
  ): void => {
    const field = create(build(current.state))

    parent.append(field.element)
    updates.push((state) => field.update(build(state)))
  }

  const hasFixedWidth = (state: PlaygroundState): boolean =>
    state.slideWidth > NO_SLIDE_WIDTH

  const isVertical = (state: PlaygroundState): boolean =>
    state.axis === VERTICAL_AXIS

  const behaviour = createSection({
    title: 'Behaviour',
    origin: 'hook',
    hint: 'Passed straight to createSwipi.'
  })

  register(behaviour.body, createToggle, (state) => ({
    label: 'loop',
    hint: 'Infinite scrolling — needs more slides than visible ones',
    checked: state.loop,
    onChange: change('loop')
  }))

  register(behaviour.body, createToggle, (state) => ({
    label: 'dragFree',
    hint: 'Momentum without snapping — the track rests where it stops',
    checked: state.dragFree,
    onChange: change('dragFree')
  }))

  register(behaviour.body, createToggle, (state) => ({
    label: 'autoplay',
    checked: state.autoplay,
    onChange: change('autoplay')
  }))

  register(behaviour.body, createNumberField, (state) => ({
    label: 'autoplaySpeed',
    hint: 'Interval between slides, ms',
    value: state.autoplaySpeed,
    disabled: !state.autoplay,
    onChange: change('autoplaySpeed'),
    ...AUTOPLAY_SPEED_LIMITS
  }))

  register(behaviour.body, createNumberField, (state) => ({
    label: 'animationSpeed',
    hint: 'Transition duration, ms',
    value: state.animationSpeed,
    onChange: change('animationSpeed'),
    ...ANIMATION_SPEED_LIMITS
  }))

  register(behaviour.body, createToggle, (state) => ({
    label: 'respectReducedMotion',
    hint: "Drops the engine's own animation while the system asks for reduced motion — off by default",
    checked: state.respectReducedMotion,
    onChange: change('respectReducedMotion')
  }))

  const geometry = createSection({
    title: 'Geometry',
    origin: 'hook',
    hint: 'slideWidth and spaceBetween only write --swipi-slide-width and --swipi-slide-gap onto the track; the CSS below reads them and the engine still measures the DOM.'
  })

  register(geometry.body, createSelectField<SwipiAxis>, (state) => ({
    label: 'axis',
    hint: 'Direction the track moves in — x reads widths and left offsets, y reads heights and top ones',
    value: state.axis,
    options: AXIS_OPTIONS,
    onChange: change('axis')
  }))

  register(geometry.body, createNumberField, (state) => ({
    label: 'startIndex',
    hint: '0-based, applied on mount only — changing it recreates the carousel',
    value: state.startIndex,
    min: 0,
    max: state.slidesCount - ONE_SLIDE,
    onChange: change('startIndex')
  }))

  register(geometry.body, createNumberField, (state) => ({
    label: 'slideWidth',
    hint: isVertical(state) ? VERTICAL_SLIDE_WIDTH_HINT : SLIDE_WIDTH_HINT,
    value: state.slideWidth,
    onChange: change('slideWidth'),
    ...SLIDE_WIDTH_LIMITS
  }))

  register(geometry.body, createNumberField, (state) => ({
    label: 'spaceBetween',
    hint: 'Gap between slides, px — a margin, never a padding',
    value: state.spaceBetween,
    onChange: change('spaceBetween'),
    ...SPACE_BETWEEN_LIMITS
  }))

  const slides = createSection({
    title: 'Slides',
    origin: 'playground',
    hint: 'What the stand renders and styles on its own — the engine never writes any of it.'
  })

  register(slides.body, createNumberField, (state) => ({
    label: 'Slides in the playground',
    hint: 'Amount of slides inside the track',
    value: state.slidesCount,
    min: MIN_SLIDES_COUNT,
    max: MAX_SLIDES_COUNT,
    onChange: change('slidesCount')
  }))

  register(slides.body, createNumberField, (state) => ({
    label: 'slidesNumber',
    hint: 'Visible slides (ignored with a fixed slideWidth, a matching config or fade-in)',
    value: state.slidesNumber,
    disabled: hasFixedWidth(state),
    onChange: change('slidesNumber'),
    ...SLIDES_NUMBER_LIMITS
  }))

  register(
    slides.body,
    createSelectField<ValueOf<SlidesAnimation>>,
    (state) => ({
      label: 'slidesAnimation',
      value: state.slidesAnimation,
      options: SLIDES_ANIMATION_OPTIONS,
      onChange: change('slidesAnimation')
    })
  )

  register(slides.body, createToggle, (state) => ({
    label: 'biasRight',
    hint: 'Shows a piece of the next slide (default animation, no fixed slideWidth)',
    checked: state.biasRight,
    disabled: hasFixedWidth(state),
    onChange: change('biasRight')
  }))

  const navigation = createSection({
    title: 'Arrows and dots',
    origin: 'playground'
  })

  register(navigation.body, createToggle, (state) => ({
    label: 'showArrows',
    checked: state.showArrows,
    onChange: change('showArrows')
  }))

  register(navigation.body, createToggle, (state) => ({
    label: 'showDots',
    checked: state.showDots,
    onChange: change('showDots')
  }))

  const responsive = createSection({
    title: 'Responsive config',
    origin: 'playground'
  })

  register(responsive.body, createToggle, (state) => ({
    label: 'config',
    hint: 'Breakpoints that override slidesNumber, spaceBetween and biasRight',
    checked: state.useConfig,
    onChange: change('useConfig')
  }))

  register(responsive.body, createConfigEditor, (state) => ({
    config: state.config,
    disabled: !state.useConfig,
    onChange: change('config')
  }))

  const accessibility = createSection({
    title: 'Accessibility',
    origin: 'playground'
  })

  register(accessibility.body, createTextField, (state) => ({
    label: 'ariaLabel',
    hint: 'Goes into the generated markup — the engine has no say in it',
    value: state.ariaLabel,
    onChange: change('ariaLabel')
  }))

  const stage = createSection({ title: 'Stage', origin: 'playground' })

  register(stage.body, createNumberField, (state) => ({
    label: 'Stage width',
    hint: 'Width of the container around the slider, px',
    value: state.stageWidth,
    onChange: change('stageWidth'),
    ...STAGE_WIDTH_LIMITS
  }))

  register(stage.body, createNumberField, (state) => ({
    label: 'Stage height',
    hint: 'Height of the viewport, px — the vertical axis needs one to measure against',
    value: state.stageHeight,
    disabled: !isVertical(state),
    onChange: change('stageHeight'),
    ...STAGE_HEIGHT_LIMITS
  }))

  stage.body.append(
    element(
      'div',
      { class: 'pg-row' },
      STAGE_PRESETS.map((preset) => {
        const button = element('button', {
          type: 'button',
          class: 'pg-button pg-button--ghost'
        })

        button.textContent = preset.label
        button.addEventListener('click', () =>
          current.update('stageWidth', preset.width)
        )

        return button
      })
    )
  )

  const panel = element('aside', { class: 'pg-controls' }, [
    behaviour.element,
    geometry.element,
    slides.element,
    navigation.element,
    responsive.element,
    accessibility.element,
    stage.element
  ])

  return {
    element: panel,
    update: (next) => {
      current = next

      updates.forEach((apply) => apply(next.state))
    }
  }
}
