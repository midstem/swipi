import { Component, input, output } from '@angular/core'
import {
  STYLES,
  CONFIG_NUMBER_FIELDS,
  EMPTY_FIELD_VALUE,
  addConfigItem,
  removeConfigItem,
  updateConfigItem
} from '@swipi/playground-core'
import type { ConfigNumberField, ConfigType } from '@swipi/playground-core'

@Component({
  selector: 'pg-config-editor',
  styles: ':host { display: contents; }',
  template: `
    <div
      [class]="STYLES.config"
      data-pg="config"
      [attr.data-disabled]="disabled()"
    >
      @for (item of config(); track $index) {
        <div [class]="STYLES.configItem">
          <div [class]="STYLES.configGrid">
            @for (field of fields; track field.key) {
              <label [class]="STYLES.configCell">
                <span [class]="STYLES.hint">{{ field.label }}</span>
                <input
                  type="number"
                  [class]="STYLES.configInput"
                  [min]="empty"
                  [disabled]="disabled()"
                  [value]="item[field.key] ?? empty"
                  (change)="changeNumber($index, field.key, $event)"
                  (input)="changeNumber($index, field.key, $event)"
                />
              </label>
            }
          </div>
          <div [class]="STYLES.configFooter">
            <label [class]="STYLES.toggleInline">
              <input
                type="checkbox"
                [class]="STYLES.checkbox"
                [disabled]="disabled()"
                [checked]="!!item.biasRight"
                (change)="changeBiasRight($index, $event)"
              />
              <span [class]="STYLES.label" data-pg="label">biasRight</span>
            </label>
            <button
              type="button"
              [class]="STYLES.ghostButton"
              [disabled]="disabled()"
              (click)="removeItem($index)"
            >
              Remove
            </button>
          </div>
        </div>
      }

      <button
        type="button"
        [class]="STYLES.button"
        [disabled]="disabled()"
        (click)="addItem()"
      >
        + Add breakpoint
      </button>

      <p [class]="STYLES.hint">
        Breakpoints are matched against <code>window.innerWidth</code>: every
        item with <code>maxWidth &gt;= window width</code> matches and the last
        matching one wins — keep them ordered from the widest to the narrowest.
      </p>
    </div>
  `
})
export class ConfigEditor {
  protected readonly STYLES = STYLES

  readonly config = input.required<ConfigType[]>()

  readonly disabled = input.required<boolean>()

  readonly changed = output<ConfigType[]>()

  readonly fields = CONFIG_NUMBER_FIELDS

  readonly empty = EMPTY_FIELD_VALUE

  addItem(): void {
    this.changed.emit(addConfigItem(this.config()))
  }

  removeItem(index: number): void {
    this.changed.emit(removeConfigItem(this.config(), index))
  }

  changeNumber(index: number, field: ConfigNumberField, event: Event): void {
    const { value } = event.target as HTMLInputElement
    const parsed = parseFloat(value)

    this.changed.emit(
      updateConfigItem(this.config(), index, {
        [field]: Number.isNaN(parsed) ? EMPTY_FIELD_VALUE : parsed
      })
    )
  }

  changeBiasRight(index: number, event: Event): void {
    const { checked } = event.target as HTMLInputElement

    this.changed.emit(
      updateConfigItem(this.config(), index, { biasRight: checked })
    )
  }
}
