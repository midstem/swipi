<template>
  <div :class="STYLES.card">
    <div :class="STYLES.cardHeader">
      <h2 :class="STYLES.cardTitle">Events</h2>
      <button type="button" :class="STYLES.ghostButton" @click="$emit('clear')">
        Clear
      </button>
    </div>
    <ul :class="STYLES.events">
      <li v-for="event in events" :key="event.id" :class="STYLES.event">
        <span :class="STYLES.eventName">{{ event.name }}</span>
        <code>{{ event.payload }}</code>
      </li>
      <li v-if="!events.length" :class="STYLES.hint">No events yet</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import type { EventLogProps } from '@swipi/playground-core'

defineProps<EventLogProps>()

defineEmits<{
  (e: 'clear'): void
}>()
</script>
