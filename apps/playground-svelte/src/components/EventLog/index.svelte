<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import type { EventLogProps } from '@swipi/playground-core'

  let { events, onClear }: EventLogProps = $props()
</script>

<div class={STYLES.card}>
  <div class={STYLES.cardHeader}>
    <h2 class={STYLES.cardTitle}>Events</h2>
    <button type="button" class={STYLES.ghostButton} onclick={onClear}>
      Clear
    </button>
  </div>
  <ul class={STYLES.events}>
    {#each events as event (event.id)}
      <li class={STYLES.event}>
        <span class={STYLES.eventName}>{event.name}</span>
        <code>{event.payload}</code>
      </li>
    {/each}
    {#if !events.length}
      <li class={STYLES.hint}>No events yet</li>
    {/if}
  </ul>
</div>
