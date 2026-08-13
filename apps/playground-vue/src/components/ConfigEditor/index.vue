<template>
  <div :class="['pg-config', { 'pg-field--disabled': disabled }]">
    <div v-for="(item, index) in config" :key="index" class="pg-config__item">
      <div class="pg-config__grid">
        <label v-for="{ key, label } in CONFIG_NUMBER_FIELDS" :key="key" class="pg-config__cell">
          <span class="pg-hint">{{ label }}</span>
          <input
            type="number"
            class="pg-input pg-input--number"
            :min="EMPTY_FIELD_VALUE"
            :disabled="disabled"
            :value="item[key] ?? EMPTY_FIELD_VALUE"
            @change="changeNumber(index, key)($event)"
            @input="changeNumber(index, key)($event)"
          />
        </label>
      </div>
      <div class="pg-config__footer">
        <label class="pg-toggle pg-toggle--inline">
          <input
            type="checkbox"
            :disabled="disabled"
            :checked="Boolean(item.biasRight)"
            @change="changeBiasRight(index)($event)"
          />
          <span class="pg-label">biasRight</span>
        </label>
        <button
          type="button"
          class="pg-button pg-button--ghost"
          :disabled="disabled"
          @click="removeItem(index)()"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      type="button"
      class="pg-button"
      :disabled="disabled"
      @click="addItem"
    >
      + Add breakpoint
    </button>

    <p class="pg-hint">
      Breakpoints are matched against <code>window.innerWidth</code>: every
      item with <code>maxWidth &gt;= window width</code> matches and the last
      matching one wins — keep them ordered from the widest to the narrowest.
    </p>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
const CONFIG_NUMBER_FIELDS = ['maxWidth', 'slidesNumber', 'spaceBetween']; // polyfill
const EMPTY_FIELD_VALUE = ''; // polyfill
import type { ConfigEditorProps } from '@swipi/playground-core'

const props = defineProps<ConfigEditorProps>()

const emit = defineEmits<{
  (e: 'change', value: ConfigEditorProps['config']): void
}>()

const update = (next: ConfigEditorProps['config']) => {
  emit('change', next)
}

const addItem = () => {
  update([...props.config, { maxWidth: EMPTY_FIELD_VALUE }])
}

const removeItem = (index: number) => () => {
  update(props.config.filter((_, i) => i !== index))
}

const changeNumber = (index: number, key: string) => (e: Event) => {
  const target = e.target as HTMLInputElement
  const rawValue = parseFloat(target.value)
  const value = isNaN(rawValue) ? undefined : rawValue

  const next = [...props.config]
  next[index] = { ...next[index], [key]: value }
  update(next)
}

const changeBiasRight = (index: number) => (e: Event) => {
  const target = e.target as HTMLInputElement
  const next = [...props.config]
  next[index] = { ...next[index], biasRight: target.checked }
  update(next)
}
</script>
