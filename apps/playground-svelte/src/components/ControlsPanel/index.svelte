<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
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
  import type { ControlsPanelProps } from '@swipi/playground-core'

  import ConfigEditor from '../ConfigEditor/index.svelte'
  import NumberField from '../NumberField/index.svelte'
  import Section from '../Section/index.svelte'
  import SelectField from '../SelectField/index.svelte'
  import TextField from '../TextField/index.svelte'
  import Toggle from '../Toggle/index.svelte'

  import { useControlsPanel } from './useControlsPanel'

  let { state: playgroundState, update }: ControlsPanelProps = $props()

  const { change, changeStageWidth } = useControlsPanel({
    update: (key, value) => update(key, value)
  })

  const hasFixedWidth = $derived(playgroundState.slideWidth > NO_SLIDE_WIDTH)
  const isVertical = $derived(playgroundState.axis === VERTICAL_AXIS)
</script>

<aside class={STYLES.controls}>
  <Section
    title="Behaviour"
    origin="hook"
    hint="Passed straight to useSwipiCarousel."
  >
    <Toggle
      label="loop"
      hint="Infinite scrolling — needs more slides than visible ones"
      checked={playgroundState.loop}
      onChange={change('loop')}
    />
    <Toggle
      label="dragFree"
      hint="Momentum without snapping — the track rests where it stops"
      checked={playgroundState.dragFree}
      onChange={change('dragFree')}
    />
    <Toggle
      label="autoplay"
      checked={playgroundState.autoplay}
      onChange={change('autoplay')}
    />
    <NumberField
      label="autoplaySpeed"
      hint="Interval between slides, ms"
      value={playgroundState.autoplaySpeed}
      {...AUTOPLAY_SPEED_LIMITS}
      disabled={!playgroundState.autoplay}
      onChange={change('autoplaySpeed')}
    />
    <NumberField
      label="animationSpeed"
      hint="Transition duration, ms"
      value={playgroundState.animationSpeed}
      {...ANIMATION_SPEED_LIMITS}
      onChange={change('animationSpeed')}
    />
    <Toggle
      label="respectReducedMotion"
      hint="Drops the hook's own animation while the system asks for reduced motion — off by default"
      checked={playgroundState.respectReducedMotion}
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
      value={playgroundState.axis}
      options={AXIS_OPTIONS}
      onChange={change('axis')}
    />
    <NumberField
      label="startIndex"
      hint="0-based, applied on mount only — changing it remounts the slider"
      value={playgroundState.startIndex}
      min={0}
      max={playgroundState.slidesCount - ONE_SLIDE}
      onChange={change('startIndex')}
    />
    <NumberField
      label="slideWidth"
      hint={isVertical
        ? 'Fixed slide size along the axis — a height while axis is y. 0 leaves the option off and slidesNumber back in charge'
        : 'Fixed slide width, px. 0 leaves the option off and slidesNumber back in charge'}
      value={playgroundState.slideWidth}
      {...SLIDE_WIDTH_LIMITS}
      onChange={change('slideWidth')}
    />
    <NumberField
      label="spaceBetween"
      hint="Gap between slides, px — a margin, never a padding"
      value={playgroundState.spaceBetween}
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
      value={playgroundState.slidesCount}
      min={MIN_SLIDES_COUNT}
      max={MAX_SLIDES_COUNT}
      onChange={change('slidesCount')}
    />
    <NumberField
      label="slidesNumber"
      hint="Visible slides (ignored with a fixed slideWidth, a matching config or fade-in)"
      value={playgroundState.slidesNumber}
      {...SLIDES_NUMBER_LIMITS}
      disabled={hasFixedWidth}
      onChange={change('slidesNumber')}
    />
    <SelectField
      label="slidesAnimation"
      value={playgroundState.slidesAnimation}
      options={SLIDES_ANIMATION_OPTIONS}
      onChange={change('slidesAnimation')}
    />
    <Toggle
      label="biasRight"
      hint="Shows a piece of the next slide (default animation, no fixed slideWidth)"
      checked={playgroundState.biasRight}
      disabled={hasFixedWidth}
      onChange={change('biasRight')}
    />
  </Section>

  <Section title="Arrows and dots" origin="playground">
    <Toggle
      label="showArrows"
      checked={playgroundState.showArrows}
      onChange={change('showArrows')}
    />
    <Toggle
      label="showDots"
      checked={playgroundState.showDots}
      onChange={change('showDots')}
    />
  </Section>

  <Section title="Responsive config" origin="playground">
    <Toggle
      label="config"
      hint="Breakpoints that override slidesNumber, spaceBetween and biasRight"
      checked={playgroundState.useConfig}
      onChange={change('useConfig')}
    />
    <ConfigEditor
      config={playgroundState.config}
      disabled={!playgroundState.useConfig}
      onChange={change('config')}
    />
  </Section>

  <Section title="Accessibility" origin="playground">
    <TextField
      label="ariaLabel"
      hint="Goes into the generated markup — the hook has no say in it"
      value={playgroundState.ariaLabel}
      onChange={change('ariaLabel')}
    />
  </Section>

  <Section title="Stage" origin="playground">
    <NumberField
      label="Stage width"
      hint="Width of the container around the slider, px"
      value={playgroundState.stageWidth}
      {...STAGE_WIDTH_LIMITS}
      onChange={change('stageWidth')}
    />
    <NumberField
      label="Stage height"
      hint="Height of the viewport, px — the vertical axis needs one to measure against"
      value={playgroundState.stageHeight}
      {...STAGE_HEIGHT_LIMITS}
      disabled={!isVertical}
      onChange={change('stageHeight')}
    />
    <div class={STYLES.row}>
      {#each STAGE_PRESETS as preset (preset.label)}
        <button
          type="button"
          class={STYLES.ghostButton}
          onclick={changeStageWidth(preset.width)}
        >
          {preset.label}
        </button>
      {/each}
    </div>
  </Section>
</aside>
