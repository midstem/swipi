<template>
  <div class="pg-card pg-card--split">
    <div>
      <h2 class="pg-card__title">onSelect state</h2>
      <pre class="pg-code">{{ swipiStateStr }}</pre>
    </div>
    <div>
      <h2 class="pg-card__title">onChange positions</h2>
      <pre class="pg-code">{{ positionsStr }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
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
