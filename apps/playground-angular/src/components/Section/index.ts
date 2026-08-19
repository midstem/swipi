import { Component, computed, input } from '@angular/core'
import type { SectionOrigin } from '@swipi/playground-core'

const BADGE: Record<SectionOrigin, string> = {
  hook: 'hook option',
  playground: 'playground only'
}

@Component({
  selector: 'pg-section',
  styles: ':host { display: contents; }',
  template: `
    <details class="pg-section pg-section--{{ origin() }}" open>
      <summary class="pg-section__title">
        {{ title() }}
        <span class="pg-section__badge">{{ badge() }}</span>
      </summary>
      <div class="pg-section__body">
        @if (hint()) {
          <p class="pg-hint">{{ hint() }}</p>
        }
        <ng-content />
      </div>
    </details>
  `
})
export class Section {
  readonly title = input.required<string>()

  readonly origin = input.required<SectionOrigin>()

  readonly hint = input<string>()

  readonly badge = computed(() => BADGE[this.origin()])
}
