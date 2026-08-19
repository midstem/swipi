import { Component, input, output } from '@angular/core'
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  clamp
} from '@swipi/playground-core'
import { createFieldId } from '../../helpers'

@Component({
  selector: 'pg-number-field',
  styles: ':host { display: contents; }',
  template: `
    <div class="pg-field" [class.pg-field--disabled]="disabled()">
      <label class="pg-label" [attr.for]="id">
        {{ label() }}
      </label>
      <div class="pg-field__row">
        @if (withSlider()) {
          <input
            type="range"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [value]="value()"
            [disabled]="disabled()"
            (change)="handleChange($event)"
            (input)="handleChange($event)"
          />
        }
        <input
          [id]="id"
          type="number"
          class="pg-input pg-input--number"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [value]="value()"
          [disabled]="disabled()"
          (change)="handleChange($event)"
          (input)="handleChange($event)"
        />
      </div>
      @if (hint()) {
        <span class="pg-hint">{{ hint() }}</span>
      }
    </div>
  `
})
export class NumberField {
  readonly label = input.required<string>()

  readonly hint = input<string>()

  readonly value = input.required<number>()

  readonly min = input(DEFAULT_MIN)

  readonly max = input(DEFAULT_MAX)

  readonly step = input(DEFAULT_STEP)

  readonly withSlider = input(true)

  readonly disabled = input(false)

  readonly changed = output<number>()

  readonly id = createFieldId('number-field')

  handleChange(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const parsed = parseFloat(value)

    this.changed.emit(
      clamp(Number.isNaN(parsed) ? this.min() : parsed, this.min(), this.max())
    )
  }
}
