import { Component, computed, input } from '@angular/core'
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
import type { SwipiAxis } from '@midstem/swipi-angular'
import type {
  PlaygroundState,
  PlaygroundStateKey,
  SlidesAnimation,
  UpdateState,
  ValueOf
} from '@swipi/playground-core'
import { ConfigEditor } from '../ConfigEditor'
import { NumberField } from '../NumberField'
import { Section } from '../Section'
import { SelectField } from '../SelectField'
import { TextField } from '../TextField'
import { Toggle } from '../Toggle'
import { useControlsPanel } from './useControlsPanel'

const VERTICAL_SLIDE_WIDTH_HINT =
  'Fixed slide size along the axis — a height while axis is y. 0 leaves the option off and slidesNumber back in charge'

const SLIDE_WIDTH_HINT =
  'Fixed slide width, px. 0 leaves the option off and slidesNumber back in charge'

@Component({
  selector: 'pg-controls-panel',
  styles: ':host { display: contents; }',
  imports: [ConfigEditor, NumberField, Section, SelectField, TextField, Toggle],
  template: `
    <aside class="pg-controls">
      <pg-section
        title="Behaviour"
        origin="hook"
        hint="Passed straight to useSwipiCarousel."
      >
        <pg-toggle
          label="loop"
          hint="Infinite scrolling — needs more slides than visible ones"
          [checked]="state().loop"
          (changed)="change('loop')($event)"
        />
        <pg-toggle
          label="dragFree"
          hint="Momentum without snapping — the track rests where it stops"
          [checked]="state().dragFree"
          (changed)="change('dragFree')($event)"
        />
        <pg-toggle
          label="autoplay"
          [checked]="state().autoplay"
          (changed)="change('autoplay')($event)"
        />
        <pg-number-field
          label="autoplaySpeed"
          hint="Interval between slides, ms"
          [value]="state().autoplaySpeed"
          [min]="autoplaySpeedLimits.min"
          [max]="autoplaySpeedLimits.max"
          [step]="autoplaySpeedLimits.step"
          [disabled]="!state().autoplay"
          (changed)="change('autoplaySpeed')($event)"
        />
        <pg-number-field
          label="animationSpeed"
          hint="Transition duration, ms"
          [value]="state().animationSpeed"
          [min]="animationSpeedLimits.min"
          [max]="animationSpeedLimits.max"
          [step]="animationSpeedLimits.step"
          (changed)="change('animationSpeed')($event)"
        />
        <pg-toggle
          label="respectReducedMotion"
          hint="Drops the hook's own animation while the system asks for reduced motion — off by default"
          [checked]="state().respectReducedMotion"
          (changed)="change('respectReducedMotion')($event)"
        />
      </pg-section>

      <pg-section
        title="Geometry"
        origin="hook"
        hint="slideWidth and spaceBetween only write --swipi-slide-width and --swipi-slide-gap onto the track; the CSS below reads them and the hook still measures the DOM."
      >
        <pg-select-field
          label="axis"
          hint="Direction the track moves in — x reads widths and left offsets, y reads heights and top ones"
          [value]="state().axis"
          [options]="axisOptions"
          (changed)="changeAxis($event)"
        />
        <pg-number-field
          label="startIndex"
          hint="0-based, applied on mount only — changing it remounts the slider"
          [value]="state().startIndex"
          [min]="0"
          [max]="state().slidesCount - oneSlide"
          (changed)="change('startIndex')($event)"
        />
        <pg-number-field
          label="slideWidth"
          [hint]="slideWidthHint()"
          [value]="state().slideWidth"
          [min]="slideWidthLimits.min"
          [max]="slideWidthLimits.max"
          [step]="slideWidthLimits.step"
          (changed)="change('slideWidth')($event)"
        />
        <pg-number-field
          label="spaceBetween"
          hint="Gap between slides, px — a margin, never a padding"
          [value]="state().spaceBetween"
          [min]="spaceBetweenLimits.min"
          [max]="spaceBetweenLimits.max"
          (changed)="change('spaceBetween')($event)"
        />
      </pg-section>

      <pg-section
        title="Slides"
        origin="playground"
        hint="What the stand renders and styles on its own — in 2.x these were props of the component."
      >
        <pg-number-field
          label="Slides in the playground"
          hint="Amount of slides inside the track"
          [value]="state().slidesCount"
          [min]="minSlidesCount"
          [max]="maxSlidesCount"
          (changed)="change('slidesCount')($event)"
        />
        <pg-number-field
          label="slidesNumber"
          hint="Visible slides (ignored with a fixed slideWidth, a matching config or fade-in)"
          [value]="state().slidesNumber"
          [min]="slidesNumberLimits.min"
          [max]="slidesNumberLimits.max"
          [disabled]="hasFixedWidth()"
          (changed)="change('slidesNumber')($event)"
        />
        <pg-select-field
          label="slidesAnimation"
          [value]="state().slidesAnimation"
          [options]="slidesAnimationOptions"
          (changed)="changeSlidesAnimation($event)"
        />
        <pg-toggle
          label="biasRight"
          hint="Shows a piece of the next slide (default animation, no fixed slideWidth)"
          [checked]="state().biasRight"
          [disabled]="hasFixedWidth()"
          (changed)="change('biasRight')($event)"
        />
      </pg-section>

      <pg-section title="Arrows and dots" origin="playground">
        <pg-toggle
          label="showArrows"
          [checked]="state().showArrows"
          (changed)="change('showArrows')($event)"
        />
        <pg-toggle
          label="showDots"
          [checked]="state().showDots"
          (changed)="change('showDots')($event)"
        />
      </pg-section>

      <pg-section title="Responsive config" origin="playground">
        <pg-toggle
          label="config"
          hint="Breakpoints that override slidesNumber, spaceBetween and biasRight"
          [checked]="state().useConfig"
          (changed)="change('useConfig')($event)"
        />
        <pg-config-editor
          [config]="state().config"
          [disabled]="!state().useConfig"
          (changed)="change('config')($event)"
        />
      </pg-section>

      <pg-section title="Accessibility" origin="playground">
        <pg-text-field
          label="ariaLabel"
          hint="Goes into the generated markup — the hook has no say in it"
          [value]="state().ariaLabel"
          (changed)="change('ariaLabel')($event)"
        />
      </pg-section>

      <pg-section title="Stage" origin="playground">
        <pg-number-field
          label="Stage width"
          hint="Width of the container around the slider, px"
          [value]="state().stageWidth"
          [min]="stageWidthLimits.min"
          [max]="stageWidthLimits.max"
          [step]="stageWidthLimits.step"
          (changed)="change('stageWidth')($event)"
        />
        <pg-number-field
          label="Stage height"
          hint="Height of the viewport, px — the vertical axis needs one to measure against"
          [value]="state().stageHeight"
          [min]="stageHeightLimits.min"
          [max]="stageHeightLimits.max"
          [step]="stageHeightLimits.step"
          [disabled]="!isVertical()"
          (changed)="change('stageHeight')($event)"
        />
        <div class="pg-row">
          @for (preset of stagePresets; track preset.label) {
            <button
              type="button"
              class="pg-button pg-button--ghost"
              (click)="changeStageWidth(preset.width)()"
            >
              {{ preset.label }}
            </button>
          }
        </div>
      </pg-section>
    </aside>
  `
})
export class ControlsPanel {
  readonly state = input.required<PlaygroundState>()

  readonly update = input.required<UpdateState>()

  readonly axisOptions = AXIS_OPTIONS

  readonly slidesAnimationOptions = SLIDES_ANIMATION_OPTIONS

  readonly stagePresets = STAGE_PRESETS

  readonly autoplaySpeedLimits = AUTOPLAY_SPEED_LIMITS

  readonly animationSpeedLimits = ANIMATION_SPEED_LIMITS

  readonly slideWidthLimits = SLIDE_WIDTH_LIMITS

  readonly spaceBetweenLimits = SPACE_BETWEEN_LIMITS

  readonly slidesNumberLimits = SLIDES_NUMBER_LIMITS

  readonly stageWidthLimits = STAGE_WIDTH_LIMITS

  readonly stageHeightLimits = STAGE_HEIGHT_LIMITS

  readonly minSlidesCount = MIN_SLIDES_COUNT

  readonly maxSlidesCount = MAX_SLIDES_COUNT

  readonly oneSlide = ONE_SLIDE

  readonly isVertical = computed(() => this.state().axis === VERTICAL_AXIS)

  readonly hasFixedWidth = computed(
    () => this.state().slideWidth > NO_SLIDE_WIDTH
  )

  readonly slideWidthHint = computed(() =>
    this.isVertical() ? VERTICAL_SLIDE_WIDTH_HINT : SLIDE_WIDTH_HINT
  )

  change<Key extends PlaygroundStateKey>(
    key: Key
  ): (value: PlaygroundState[Key]) => void {
    return useControlsPanel({ update: this.update() }).change(key)
  }

  changeStageWidth(width: number): () => void {
    return useControlsPanel({ update: this.update() }).changeStageWidth(width)
  }

  changeAxis(value: string): void {
    this.change('axis')(value as SwipiAxis)
  }

  changeSlidesAnimation(value: string): void {
    this.change('slidesAnimation')(value as ValueOf<SlidesAnimation>)
  }
}
