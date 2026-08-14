<template>
  <div class="pg-field">
    <label class="pg-label" :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      type="text"
      class="pg-input"
      :value="value"
      :placeholder="placeholder"
      @change="$emit('change', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="hint" class="pg-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TextFieldProps } from '@swipi/playground-core'

defineProps<TextFieldProps>()

defineEmits<{
  (e: 'change', value: string): void
}>()

const id = ref(`text-field-${Math.random().toString(36).slice(2, 9)}`)
</script>
