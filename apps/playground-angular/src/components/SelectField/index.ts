import { Component, input, output } from '@angular/core'
import type { SelectOption } from '@swipi/playground-core'
import { createFieldId } from '../../helpers'
import { STYLES } from '@swipi/playground-core'

@Component({
  selector: 'pg-select-field',
  styles: ':host { display: contents; }',
  template: `
    <div [class]="STYLES.field" data-pg="field">
      <label [class]="STYLES.label" data-pg="label" [attr.for]="id">
        {{ label() }}
      </label>
      <select
        [id]="id"
        [class]="STYLES.select"
        [value]="value()"
        (change)="handleChange($event)"
      >
        @for (option of options(); track option.value) {
          <option [value]="option.value" [selected]="option.value === value()">
            {{ option.label }}
          </option>
        }
      </select>
      @if (hint()) {
        <span [class]="STYLES.hint">{{ hint() }}</span>
      }
    </div>
  `
})
export class SelectField {
  protected readonly STYLES = STYLES

  readonly label = input.required<string>()

  readonly hint = input<string>()

  readonly value = input.required<string>()

  readonly options = input.required<SelectOption<string>[]>()

  readonly changed = output<string>()

  readonly id = createFieldId('select-field')

  handleChange(event: Event): void {
    const { value } = event.target as HTMLSelectElement

    this.changed.emit(value)
  }
}
