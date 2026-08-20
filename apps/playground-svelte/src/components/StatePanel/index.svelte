<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import { JSON_INDENT } from '@swipi/playground-core'
  import type { StatePanelProps } from '@swipi/playground-core'

  let { swipiState, positions }: StatePanelProps = $props()
</script>

<div class={STYLES.cardSplit}>
  <div>
    <h2 class={STYLES.cardTitle}>onSelect state</h2>
    <pre class={STYLES.code}>{JSON.stringify(
        swipiState,
        null,
        JSON_INDENT
      )}</pre>
  </div>
  <div>
    <h2 class={STYLES.cardTitle}>onChange positions</h2>
    <pre class={STYLES.code}>{JSON.stringify(
        positions,
        null,
        JSON_INDENT
      )}</pre>
  </div>
</div>
