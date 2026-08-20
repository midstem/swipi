<template>
  <aside :class="STYLES.controls">
    <Section
      title="Behaviour"
      origin="hook"
      hint="Passed straight to useSwipiCarousel."
    >
      <Toggle
        label="loop"
        hint="Infinite scrolling — needs more slides than visible ones"
        :checked="state.loop"
        @change="change('loop')($event)"
      />
      <Toggle
        label="dragFree"
        hint="Momentum without snapping — the track rests where it stops"
        :checked="state.dragFree"
        @change="change('dragFree')($event)"
      />
      <Toggle
        label="autoplay"
        :checked="state.autoplay"
        @change="change('autoplay')($event)"
      />
      <NumberField
        label="autoplaySpeed"
        hint="Interval between slides, ms"
        :value="state.autoplaySpeed"
        v-bind="AUTOPLAY_SPEED_LIMITS"
        :disabled="!state.autoplay"
        @change="change('autoplaySpeed')($event)"
      />
      <NumberField
        label="animationSpeed"
        hint="Transition duration, ms"
        :value="state.animationSpeed"
        v-bind="ANIMATION_SPEED_LIMITS"
        @change="change('animationSpeed')($event)"
      />
      <Toggle
        label="respectReducedMotion"
        hint="Drops the hook's own animation while the system asks for reduced motion — off by default"
        :checked="state.respectReducedMotion"
        @change="change('respectReducedMotion')($event)"
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
        :value="state.axis"
        :options="AXIS_OPTIONS"
        @change="change('axis')($event)"
      />
      <NumberField
        label="startIndex"
        hint="0-based, applied on mount only — changing it remounts the slider"
        :value="state.startIndex"
        :min="0"
        :max="state.slidesCount - ONE_SLIDE"
        @change="change('startIndex')($event)"
      />
      <NumberField
        label="slideWidth"
        :hint="
          isVertical
            ? 'Fixed slide size along the axis — a height while axis is y. 0 leaves the option off and slidesNumber back in charge'
            : 'Fixed slide width, px. 0 leaves the option off and slidesNumber back in charge'
        "
        :value="state.slideWidth"
        v-bind="SLIDE_WIDTH_LIMITS"
        @change="change('slideWidth')($event)"
      />
      <NumberField
        label="spaceBetween"
        hint="Gap between slides, px — a margin, never a padding"
        :value="state.spaceBetween"
        v-bind="SPACE_BETWEEN_LIMITS"
        @change="change('spaceBetween')($event)"
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
        :value="state.slidesCount"
        :min="MIN_SLIDES_COUNT"
        :max="MAX_SLIDES_COUNT"
        @change="change('slidesCount')($event)"
      />
      <NumberField
        label="slidesNumber"
        hint="Visible slides (ignored with a fixed slideWidth, a matching config or fade-in)"
        :value="state.slidesNumber"
        v-bind="SLIDES_NUMBER_LIMITS"
        :disabled="hasFixedWidth"
        @change="change('slidesNumber')($event)"
      />
      <SelectField
        label="slidesAnimation"
        :value="state.slidesAnimation"
        :options="SLIDES_ANIMATION_OPTIONS"
        @change="change('slidesAnimation')($event)"
      />
      <Toggle
        label="biasRight"
        hint="Shows a piece of the next slide (default animation, no fixed slideWidth)"
        :checked="state.biasRight"
        :disabled="hasFixedWidth"
        @change="change('biasRight')($event)"
      />
    </Section>

    <Section title="Arrows and dots" origin="playground">
      <Toggle
        label="showArrows"
        :checked="state.showArrows"
        @change="change('showArrows')($event)"
      />
      <Toggle
        label="showDots"
        :checked="state.showDots"
        @change="change('showDots')($event)"
      />
    </Section>

    <Section title="Responsive config" origin="playground">
      <Toggle
        label="config"
        hint="Breakpoints that override slidesNumber, spaceBetween and biasRight"
        :checked="state.useConfig"
        @change="change('useConfig')($event)"
      />
      <ConfigEditor
        :config="state.config"
        :disabled="!state.useConfig"
        @change="change('config')($event)"
      />
    </Section>

    <Section title="Accessibility" origin="playground">
      <TextField
        label="ariaLabel"
        hint="Goes into the generated markup — the hook has no say in it"
        :value="state.ariaLabel"
        @change="change('ariaLabel')($event)"
      />
    </Section>

    <Section title="Stage" origin="playground">
      <NumberField
        label="Stage width"
        hint="Width of the container around the slider, px"
        :value="state.stageWidth"
        v-bind="STAGE_WIDTH_LIMITS"
        @change="change('stageWidth')($event)"
      />
      <NumberField
        label="Stage height"
        hint="Height of the viewport, px — the vertical axis needs one to measure against"
        :value="state.stageHeight"
        v-bind="STAGE_HEIGHT_LIMITS"
        :disabled="!isVertical"
        @change="change('stageHeight')($event)"
      />
      <div :class="STYLES.row">
        <button
          v-for="preset in STAGE_PRESETS"
          :key="preset.label"
          type="button"
          :class="STYLES.ghostButton"
          @click="changeStageWidth(preset.width)()"
        >
          {{ preset.label }}
        </button>
      </div>
    </Section>
  </aside>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { computed } from 'vue'
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

import ConfigEditor from '../ConfigEditor/index.vue'
import NumberField from '../NumberField/index.vue'
import Section from '../Section/index.vue'
import SelectField from '../SelectField/index.vue'
import TextField from '../TextField/index.vue'
import Toggle from '../Toggle/index.vue'

import { useControlsPanel } from './useControlsPanel'

const props = defineProps<ControlsPanelProps>()

const { change, changeStageWidth } = useControlsPanel({ update: props.update })

const hasFixedWidth = computed(() => props.state.slideWidth > NO_SLIDE_WIDTH)
const isVertical = computed(() => props.state.axis === VERTICAL_AXIS)
</script>
