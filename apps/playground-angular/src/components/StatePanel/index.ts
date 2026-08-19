import { Component, computed, input } from '@angular/core'
import { JSON_INDENT } from '@swipi/playground-core'
import type { SlidePositions, SwipiState } from '@midstem/swipi-angular'

@Component({
  selector: 'pg-state-panel',
  styles: ':host { display: contents; }',
  template: `
    <div class="pg-card pg-card--split">
      <div>
        <h2 class="pg-card__title">onSelect state</h2>
        <pre class="pg-code">{{ swipiStateStr() }}</pre>
      </div>
      <div>
        <h2 class="pg-card__title">onChange positions</h2>
        <pre class="pg-code">{{ positionsStr() }}</pre>
      </div>
    </div>
  `
})
export class StatePanel {
  readonly swipiState = input<SwipiState>()

  readonly positions = input<SlidePositions>()

  readonly swipiStateStr = computed(() =>
    JSON.stringify(this.swipiState(), null, JSON_INDENT)
  )

  readonly positionsStr = computed(() =>
    JSON.stringify(this.positions(), null, JSON_INDENT)
  )
}
