<template>
  <label class="pg-toggle">
    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <span class="pg-toggle__text">
      <span class="pg-label">{{ label }}</span>
      <span v-if="hint" class="pg-hint">{{ hint }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
// @ts-nocheck
import type { ToggleProps } from '@swipi/playground-core'

const props = withDefaults(defineProps<ToggleProps>(), {
  disabled: false
})

defineEmits<{
  (e: 'change', checked: boolean): void
}>()
</script>
