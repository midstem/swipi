<template>
  <div class="pg-card">
    <div class="pg-card__header">
      <h2 class="pg-card__title">Events</h2>
      <button
        type="button"
        class="pg-button pg-button--ghost"
        @click="$emit('clear')"
      >
        Clear
      </button>
    </div>
    <ul class="pg-events">
      <li v-for="event in events" :key="event.id">
        <span class="pg-events__name">{{ event.name }}</span>
        <code>{{ event.payload }}</code>
      </li>
      <li v-if="!events.length" class="pg-hint">No events yet</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import type { EventLogProps } from '@swipi/playground-core'

defineProps<EventLogProps>()

defineEmits<{
  (e: 'clear'): void
}>()
</script>
