import { Component, input, output } from '@angular/core'

@Component({
  selector: 'pg-toggle',
  styles: ':host { display: contents; }',
  template: `
    <label class="pg-toggle">
      <input
        type="checkbox"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="handleChange($event)"
      />
      <span class="pg-toggle__text">
        <span class="pg-label">{{ label() }}</span>
        @if (hint()) {
          <span class="pg-hint">{{ hint() }}</span>
        }
      </span>
    </label>
  `
})
export class Toggle {
  readonly label = input.required<string>()

  readonly hint = input<string>()

  readonly checked = input.required<boolean>()

  readonly disabled = input(false)

  readonly changed = output<boolean>()

  handleChange(event: Event): void {
    const { checked } = event.target as HTMLInputElement

    this.changed.emit(checked)
  }
}
