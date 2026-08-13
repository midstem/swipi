import type { JSX } from 'react'
import {
  AXIS_OPTIONS,
  MAX_SLIDES_COUNT,
  MIN_SLIDES_COUNT,
  NO_SLIDE_WIDTH,
  ONE_SLIDE,
  SLIDES_ANIMATION_OPTIONS,
  STAGE_PRESETS,
  VERTICAL_AXIS
} from '@swipi/playground-core'
import { ControlsPanelProps } from '@swipi/playground-core'
import ConfigEditor from '../ConfigEditor'
import NumberField from '../NumberField'
import Section from '../Section'
import SelectField from '../SelectField'
import TextField from '../TextField'
import Toggle from '../Toggle'
import {
  ANIMATION_SPEED_LIMITS,
  AUTOPLAY_SPEED_LIMITS,
  SLIDES_NUMBER_LIMITS,
  SLIDE_WIDTH_LIMITS,
  SPACE_BETWEEN_LIMITS,
  STAGE_HEIGHT_LIMITS,
  STAGE_WIDTH_LIMITS
} from '@swipi/playground-core'
import { useControlsPanel } from './useControlsPanel'

const ControlsPanel = ({ state, update }: ControlsPanelProps): JSX.Element => {
  const { change, changeStageWidth } = useControlsPanel({ update })

  const hasFixedWidth = state.slideWidth > NO_SLIDE_WIDTH
  const isVertical = state.axis === VERTICAL_AXIS

  return (
    <aside className="pg-controls">
      <Section
        title="Behaviour"
        origin="hook"
        hint="Passed straight to useSwipiCarousel."
      >
        <Toggle
          label="loop"
          hint="Infinite scrolling — needs more slides than visible ones"
          checked={state.loop}
          onChange={change('loop')}
        />
        <Toggle
          label="dragFree"
          hint="Momentum without snapping — the track rests where it stops"
          checked={state.dragFree}
          onChange={change('dragFree')}
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
        <Toggle
          label="respectReducedMotion"
          hint="Drops the hook's own animation while the system asks for reduced motion — off by default"
          checked={state.respectReducedMotion}
          onChange={change('respectReducedMotion')}
        />
      </Section>

      <Section
        title="Geometry"
        origin="hook"
        hint="slideWidth and spaceBetween only write --swipi-slide-width and --swipi-slide-gap onto the track; the CSS below reads them and the hook still measures the DOM."
      >
        <SelectField
          label="axis"
          hint="Direction the track moves in — x reads widths and left offsets, y reads heights and top ones"
          value={state.axis}
          options={AXIS_OPTIONS}
          onChange={change('axis')}
        />
        <NumberField
          label="startIndex"
          hint="0-based, applied on mount only — changing it remounts the slider"
          value={state.startIndex}
          min={0}
          max={state.slidesCount - ONE_SLIDE}
          onChange={change('startIndex')}
        />
        <NumberField
          label="slideWidth"
          hint={
            isVertical
              ? 'Fixed slide size along the axis — a height while axis is y. 0 leaves the option off and slidesNumber back in charge'
              : 'Fixed slide width, px. 0 leaves the option off and slidesNumber back in charge'
          }
          value={state.slideWidth}
          {...SLIDE_WIDTH_LIMITS}
          onChange={change('slideWidth')}
        />
        <NumberField
          label="spaceBetween"
          hint="Gap between slides, px — a margin, never a padding"
          value={state.spaceBetween}
          {...SPACE_BETWEEN_LIMITS}
          onChange={change('spaceBetween')}
        />
      </Section>

      <Section
        title="Slides"
        origin="playground"
        hint="What the stand renders and styles on its own — in 2.x these were props of the component."
      >
        <NumberField
          label="Slides in the playground"
          hint="Amount of slides inside the track"
          value={state.slidesCount}
          min={MIN_SLIDES_COUNT}
          max={MAX_SLIDES_COUNT}
          onChange={change('slidesCount')}
        />
        <NumberField
          label="slidesNumber"
          hint="Visible slides (ignored with a fixed slideWidth, a matching config or fade-in)"
          value={state.slidesNumber}
          {...SLIDES_NUMBER_LIMITS}
          disabled={hasFixedWidth}
          onChange={change('slidesNumber')}
        />
        <SelectField
          label="slidesAnimation"
          value={state.slidesAnimation}
          options={SLIDES_ANIMATION_OPTIONS}
          onChange={change('slidesAnimation')}
        />
        <Toggle
          label="biasRight"
          hint="Shows a piece of the next slide (default animation, no fixed slideWidth)"
          checked={state.biasRight}
          disabled={hasFixedWidth}
          onChange={change('biasRight')}
        />
      </Section>

      <Section title="Arrows and dots" origin="playground">
        <Toggle
          label="showArrows"
          checked={state.showArrows}
          onChange={change('showArrows')}
        />
        <Toggle
          label="showDots"
          checked={state.showDots}
          onChange={change('showDots')}
        />
      </Section>

      <Section title="Responsive config" origin="playground">
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

      <Section title="Accessibility" origin="playground">
        <TextField
          label="ariaLabel"
          hint="Goes into the generated markup — the hook has no say in it"
          value={state.ariaLabel}
          onChange={change('ariaLabel')}
        />
      </Section>

      <Section title="Stage" origin="playground">
        <NumberField
          label="Stage width"
          hint="Width of the container around the slider, px"
          value={state.stageWidth}
          {...STAGE_WIDTH_LIMITS}
          onChange={change('stageWidth')}
        />
        <NumberField
          label="Stage height"
          hint="Height of the viewport, px — the vertical axis needs one to measure against"
          value={state.stageHeight}
          {...STAGE_HEIGHT_LIMITS}
          disabled={!isVertical}
          onChange={change('stageHeight')}
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
