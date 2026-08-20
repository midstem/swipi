import { Component, input, output } from '@angular/core'
import { createFieldId } from '../../helpers'
import { STYLES } from '@swipi/playground-core'

@Component({
  selector: 'pg-text-field',
  styles: ':host { display: contents; }',
  template: `
    <div [class]="STYLES.field" data-pg="field">
      <label [class]="STYLES.label" data-pg="label" [attr.for]="id">
        {{ label() }}
      </label>
      <input
        [id]="id"
        type="text"
        [class]="STYLES.input"
        [value]="value()"
        [attr.placeholder]="placeholder()"
        (change)="handleChange($event)"
      />
      @if (hint()) {
        <span [class]="STYLES.hint">{{ hint() }}</span>
      }
    </div>
  `
})
export class TextField {
  protected readonly STYLES = STYLES

  readonly label = input.required<string>()

  readonly hint = input<string>()

  readonly value = input.required<string>()

  readonly placeholder = input<string>()

  readonly changed = output<string>()

  readonly id = createFieldId('text-field')

  handleChange(event: Event): void {
    const { value } = event.target as HTMLInputElement

    this.changed.emit(value)
  }
}
