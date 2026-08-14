<template>
  <div :class="['pg-field', { 'pg-field--disabled': disabled }]">
    <label class="pg-label" :for="id">
      {{ label }}
    </label>
    <div class="pg-field__row">
      <input
        v-if="withSlider"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        @change="handleChange"
        @input="handleChange"
      />
      <input
        :id="id"
        type="number"
        class="pg-input pg-input--number"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        @change="handleChange"
        @input="handleChange"
      />
    </div>
    <span v-if="hint" class="pg-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  clamp
} from '@swipi/playground-core'
import type { NumberFieldProps } from '@swipi/playground-core'

const props = withDefaults(defineProps<NumberFieldProps>(), {
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  step: DEFAULT_STEP,
  withSlider: true,
  disabled: false
})

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const id = ref(`number-field-${Math.random().toString(36).slice(2, 9)}`)

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const rawValue = parseFloat(target.value)
  const value = Number.isNaN(rawValue) ? props.min : rawValue

  emit('change', clamp(value, props.min, props.max))
}
</script>
