<template>
  <details :class="STYLES.section" data-pg="section" :data-origin="origin" open>
    <summary :class="STYLES.sectionTitle">
      {{ title }}
      <span :class="STYLES.sectionBadge">{{ BADGE[origin] }}</span>
    </summary>
    <div :class="STYLES.sectionBody">
      <p v-if="hint" :class="STYLES.hint">{{ hint }}</p>
      <slot></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import type { SectionProps } from '@swipi/playground-core'

defineProps<SectionProps>()

const BADGE = {
  hook: 'hook option',
  playground: 'playground only'
} as const
</script>
