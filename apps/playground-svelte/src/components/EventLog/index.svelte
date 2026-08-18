<script lang="ts">
  import type { EventLogProps } from '@swipi/playground-core'

  let { events, onClear }: EventLogProps = $props()
</script>

<div class="pg-card">
  <div class="pg-card__header">
    <h2 class="pg-card__title">Events</h2>
    <button type="button" class="pg-button pg-button--ghost" onclick={onClear}>
      Clear
    </button>
  </div>
  <ul class="pg-events">
    {#each events as event (event.id)}
      <li>
        <span class="pg-events__name">{event.name}</span>
        <code>{event.payload}</code>
      </li>
    {/each}
    {#if !events.length}
      <li class="pg-hint">No events yet</li>
    {/if}
  </ul>
</div>
