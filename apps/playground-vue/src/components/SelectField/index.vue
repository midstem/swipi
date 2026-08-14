<template>
  <div class="pg-field">
    <label class="pg-label" :for="id">
      {{ label }}
    </label>
    <select
      :id="id"
      class="pg-input"
      :value="value"
      @change="
        $emit('change', ($event.target as HTMLSelectElement).value as Value)
      "
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span v-if="hint" class="pg-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts" generic="Value extends string">
import { ref } from 'vue'
import type { SelectFieldProps } from '@swipi/playground-core'

defineProps<SelectFieldProps<Value>>()

defineEmits<{
  (e: 'change', value: Value): void
}>()

const id = ref(`select-field-${Math.random().toString(36).slice(2, 9)}`)
</script>
