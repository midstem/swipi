<template>
  <details :class="['pg-section', `pg-section--${origin}`]" open>
    <summary class="pg-section__title">
      {{ title }}
      <span class="pg-section__badge">{{ BADGE[origin] }}</span>
    </summary>
    <div class="pg-section__body">
      <p v-if="hint" class="pg-hint">{{ hint }}</p>
      <slot></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
// @ts-nocheck
import type { SectionProps } from '@swipi/playground-core'

const props = defineProps<SectionProps>()

const BADGE = {
  hook: 'hook option',
  playground: 'playground only'
} as const
</script>
