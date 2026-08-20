<template>
  <div :class="STYLES.field" data-pg="field">
    <label :class="STYLES.label" data-pg="label" :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      type="text"
      :class="STYLES.input"
      :value="value"
      :placeholder="placeholder"
      @change="$emit('change', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="hint" :class="STYLES.hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { ref } from 'vue'
import type { TextFieldProps } from '@swipi/playground-core'

defineProps<TextFieldProps>()

defineEmits<{
  (e: 'change', value: string): void
}>()

const id = ref(`text-field-${Math.random().toString(36).slice(2, 9)}`)
</script>
