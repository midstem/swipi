<script lang="ts">
  import { JSON_INDENT } from '@swipi/playground-core'
  import type { StatePanelProps } from '@swipi/playground-core'

  let { swipiState, positions }: StatePanelProps = $props()
</script>

<div class="pg-card pg-card--split">
  <div>
    <h2 class="pg-card__title">onSelect state</h2>
    <pre class="pg-code">{JSON.stringify(swipiState, null, JSON_INDENT)}</pre>
  </div>
  <div>
    <h2 class="pg-card__title">onChange positions</h2>
    <pre class="pg-code">{JSON.stringify(positions, null, JSON_INDENT)}</pre>
  </div>
</div>
