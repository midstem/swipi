import type { JSX } from 'react'
import {
  DOTS_ANIMATION_OPTIONS,
  MAX_SLIDES_COUNT,
  MIN_SLIDES_COUNT,
  SLIDES_ANIMATION_OPTIONS,
  STAGE_PRESETS
} from '../../constants'
import { ControlsPanelProps } from '../../types'
import ColorField from '../ColorField'
import ConfigEditor from '../ConfigEditor'
import NumberField from '../NumberField'
import Section from '../Section'
import SelectField from '../SelectField'
import TextField from '../TextField'
import Toggle from '../Toggle'
import {
  ANIMATION_SPEED_LIMITS,
  AUTOPLAY_SPEED_LIMITS,
  DOT_SIZE_LIMITS,
  SLIDES_NUMBER_LIMITS,
  SPACE_BETWEEN_LIMITS,
  STAGE_WIDTH_LIMITS
} from './constants'
import { useControlsPanel } from './useControlsPanel'

const ControlsPanel = ({ state, update }: ControlsPanelProps): JSX.Element => {
  const { change, changeStageWidth } = useControlsPanel({ update })

  return (
    <aside className="pg-controls">
      <Section title="Slides">
        <NumberField
          label="Slides in the playground"
          hint="Amount of children passed to Swipi"
          value={state.slidesCount}
          min={MIN_SLIDES_COUNT}
          max={MAX_SLIDES_COUNT}
          onChange={change('slidesCount')}
        />
        <NumberField
          label="slidesNumber"
          hint="Visible slides (ignored when config matches or with fade-in)"
          value={state.slidesNumber}
          {...SLIDES_NUMBER_LIMITS}
          onChange={change('slidesNumber')}
        />
        <NumberField
          label="spaceBetweenSlides"
          value={state.spaceBetweenSlides}
          {...SPACE_BETWEEN_LIMITS}
          onChange={change('spaceBetweenSlides')}
        />
        <NumberField
          label="initialSlide"
          hint="1-based, applied on mount only — changing it remounts the slider"
          value={state.initialSlide}
          min={0}
          max={state.slidesCount}
          onChange={change('initialSlide')}
        />
        <SelectField
          label="slidesAnimation"
          value={state.slidesAnimation}
          options={SLIDES_ANIMATION_OPTIONS}
          onChange={change('slidesAnimation')}
        />
        <Toggle
          label="biasRight"
          hint="Shows a piece of the next slide (default animation only)"
          checked={state.biasRight}
          onChange={change('biasRight')}
        />
      </Section>

      <Section title="Behaviour">
        <Toggle
          label="loop"
          hint="Infinite scrolling — needs more slides than visible ones"
          checked={state.loop}
          onChange={change('loop')}
        />
        <Toggle
          label="autoplay"
          checked={state.autoplay}
          onChange={change('autoplay')}
        />
        <NumberField
          label="autoplaySpeed"
          hint="Interval between slides, ms"
          value={state.autoplaySpeed}
          {...AUTOPLAY_SPEED_LIMITS}
          disabled={!state.autoplay}
          onChange={change('autoplaySpeed')}
        />
        <NumberField
          label="animationSpeed"
          hint="Transition duration, ms"
          value={state.animationSpeed}
          {...ANIMATION_SPEED_LIMITS}
          onChange={change('animationSpeed')}
        />
      </Section>

      <Section title="Arrows">
        <Toggle
          label="showArrows"
          checked={state.showArrows}
          onChange={change('showArrows')}
        />
        <TextField
          label="prevButton"
          value={state.prevButton}
          onChange={change('prevButton')}
        />
        <TextField
          label="nextButton"
          value={state.nextButton}
          onChange={change('nextButton')}
        />
      </Section>

      <Section title="Dots">
        <Toggle
          label="showDots"
          checked={state.showDots}
          onChange={change('showDots')}
        />
        <SelectField
          label="dotsAnimation"
          value={state.dotsAnimation}
          options={DOTS_ANIMATION_OPTIONS}
          onChange={change('dotsAnimation')}
        />
        <ColorField
          label="dotColor"
          value={state.dotColor}
          onChange={change('dotColor')}
        />
        <ColorField
          label="activeDotColor"
          value={state.activeDotColor}
          onChange={change('activeDotColor')}
        />
        <NumberField
          label="sizeForDefaultDot"
          value={state.sizeForDefaultDot}
          {...DOT_SIZE_LIMITS}
          onChange={change('sizeForDefaultDot')}
        />
        <NumberField
          label="sizeForDefaultActiveDot"
          value={state.sizeForDefaultActiveDot}
          {...DOT_SIZE_LIMITS}
          onChange={change('sizeForDefaultActiveDot')}
        />
        <Toggle
          label="customDot"
          hint="Replaces the default dot with a custom element"
          checked={state.customDot}
          onChange={change('customDot')}
        />
        <Toggle
          label="customActiveDot"
          hint="Replaces the default active dot with a custom element"
          checked={state.customActiveDot}
          onChange={change('customActiveDot')}
        />
      </Section>

      <Section title="Responsive config">
        <Toggle
          label="config"
          hint="Breakpoints that override slidesNumber, spaceBetween and biasRight"
          checked={state.useConfig}
          onChange={change('useConfig')}
        />
        <ConfigEditor
          config={state.config}
          disabled={!state.useConfig}
          onChange={change('config')}
        />
      </Section>

      <Section title="Accessibility & styling">
        <TextField
          label="ariaLabel"
          value={state.ariaLabel}
          onChange={change('ariaLabel')}
        />
        <TextField
          label="className"
          placeholder="my-slider"
          value={state.className}
          onChange={change('className')}
        />
      </Section>

      <Section title="Stage">
        <NumberField
          label="Stage width"
          hint="Width of the container around the slider, px"
          value={state.stageWidth}
          {...STAGE_WIDTH_LIMITS}
          onChange={change('stageWidth')}
        />
        <div className="pg-row">
          {STAGE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="pg-button pg-button--ghost"
              onClick={changeStageWidth(preset.width)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Section>
    </aside>
  )
}

export default ControlsPanel
