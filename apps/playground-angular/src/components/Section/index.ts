import { Component, computed, input } from '@angular/core'
import type { SectionOrigin } from '@swipi/playground-core'
import { STYLES } from '@swipi/playground-core'

const BADGE: Record<SectionOrigin, string> = {
  hook: 'hook option',
  playground: 'playground only'
}

@Component({
  selector: 'pg-section',
  styles: ':host { display: contents; }',
  template: `
    <details
      [class]="STYLES.section"
      data-pg="section"
      [attr.data-origin]="origin()"
      open
    >
      <summary [class]="STYLES.sectionTitle">
        {{ title() }}
        <span [class]="STYLES.sectionBadge">{{ badge() }}</span>
      </summary>
      <div [class]="STYLES.sectionBody">
        @if (hint()) {
          <p [class]="STYLES.hint">{{ hint() }}</p>
        }
        <ng-content />
      </div>
    </details>
  `
})
export class Section {
  protected readonly STYLES = STYLES

  readonly title = input.required<string>()

  readonly origin = input.required<SectionOrigin>()

  readonly hint = input<string>()

  readonly badge = computed(() => BADGE[this.origin()])
}
