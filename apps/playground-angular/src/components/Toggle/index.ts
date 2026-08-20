import { Component, input, output } from '@angular/core'
import { STYLES } from '@swipi/playground-core'

@Component({
  selector: 'pg-toggle',
  styles: ':host { display: contents; }',
  template: `
    <label [class]="STYLES.toggle" data-pg="toggle">
      <input
        type="checkbox"
        [class]="STYLES.checkbox"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="handleChange($event)"
      />
      <span [class]="STYLES.toggleText">
        <span [class]="STYLES.label" data-pg="label">{{ label() }}</span>
        @if (hint()) {
          <span [class]="STYLES.hint">{{ hint() }}</span>
        }
      </span>
    </label>
  `
})
export class Toggle {
  protected readonly STYLES = STYLES

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
