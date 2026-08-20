<template>
  <div :class="STYLES.field" data-pg="field">
    <label :class="STYLES.label" data-pg="label" :for="id">
      {{ label }}
    </label>
    <select
      :id="id"
      :class="STYLES.select"
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
    <span v-if="hint" :class="STYLES.hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts" generic="Value extends string">
import { STYLES } from '@swipi/playground-core'
import { ref } from 'vue'
import type { SelectFieldProps } from '@swipi/playground-core'

defineProps<SelectFieldProps<Value>>()

defineEmits<{
  (e: 'change', value: Value): void
}>()

const id = ref(`select-field-${Math.random().toString(36).slice(2, 9)}`)
</script>
