<template>
  <div :class="STYLES.cardSplit">
    <div>
      <h2 :class="STYLES.cardTitle">onSelect state</h2>
      <pre :class="STYLES.code">{{ swipiStateStr }}</pre>
    </div>
    <div>
      <h2 :class="STYLES.cardTitle">onChange positions</h2>
      <pre :class="STYLES.code">{{ positionsStr }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { computed } from 'vue'
import { JSON_INDENT } from '@swipi/playground-core'
import type { StatePanelProps } from '@swipi/playground-core'

const props = defineProps<StatePanelProps>()

const swipiStateStr = computed(() =>
  JSON.stringify(props.swipiState, null, JSON_INDENT)
)
const positionsStr = computed(() =>
  JSON.stringify(props.positions, null, JSON_INDENT)
)
</script>
