import { Component, input, output } from '@angular/core'
import { createFieldId } from '../../helpers'

@Component({
  selector: 'pg-text-field',
  styles: ':host { display: contents; }',
  template: `
    <div class="pg-field">
      <label class="pg-label" [attr.for]="id">
        {{ label() }}
      </label>
      <input
        [id]="id"
        type="text"
        class="pg-input"
        [value]="value()"
        [attr.placeholder]="placeholder()"
        (change)="handleChange($event)"
      />
      @if (hint()) {
        <span class="pg-hint">{{ hint() }}</span>
      }
    </div>
  `
})
export class TextField {
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
