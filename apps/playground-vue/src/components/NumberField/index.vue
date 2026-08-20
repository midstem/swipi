<template>
  <div :class="STYLES.field" data-pg="field" :data-disabled="disabled">
    <label :class="STYLES.label" data-pg="label" :for="id">
      {{ label }}
    </label>
    <div :class="STYLES.fieldRow">
      <input
        v-if="withSlider"
        type="range"
        :class="STYLES.range"
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
        :class="STYLES.numberInput"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        @change="handleChange"
        @input="handleChange"
      />
    </div>
    <span v-if="hint" :class="STYLES.hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
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
