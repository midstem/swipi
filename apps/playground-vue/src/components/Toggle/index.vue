<template>
  <label :class="STYLES.toggle" data-pg="toggle">
    <input
      type="checkbox"
      :class="STYLES.checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <span :class="STYLES.toggleText">
      <span :class="STYLES.label" data-pg="label">{{ label }}</span>
      <span v-if="hint" :class="STYLES.hint">{{ hint }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import type { ToggleProps } from '@swipi/playground-core'

withDefaults(defineProps<ToggleProps>(), {
  disabled: false
})

defineEmits<{
  (e: 'change', checked: boolean): void
}>()
</script>
