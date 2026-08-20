<template>
  <div :class="STYLES.config" data-pg="config" :data-disabled="disabled">
    <div
      v-for="(item, index) in config"
      :key="index"
      :class="STYLES.configItem"
    >
      <div :class="STYLES.configGrid">
        <label
          v-for="{ key, label } in CONFIG_NUMBER_FIELDS"
          :key="key"
          :class="STYLES.configCell"
        >
          <span :class="STYLES.hint">{{ label }}</span>
          <input
            type="number"
            :class="STYLES.configInput"
            :min="EMPTY_FIELD_VALUE"
            :disabled="disabled"
            :value="item[key] ?? EMPTY_FIELD_VALUE"
            @change="changeNumber(index, key)($event)"
            @input="changeNumber(index, key)($event)"
          />
        </label>
      </div>
      <div :class="STYLES.configFooter">
        <label :class="STYLES.toggleInline">
          <input
            type="checkbox"
            :class="STYLES.checkbox"
            :disabled="disabled"
            :checked="Boolean(item.biasRight)"
            @change="changeBiasRight(index)($event)"
          />
          <span :class="STYLES.label" data-pg="label">biasRight</span>
        </label>
        <button
          type="button"
          :class="STYLES.ghostButton"
          :disabled="disabled"
          @click="removeItem(index)()"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      type="button"
      :class="STYLES.button"
      :disabled="disabled"
      @click="addItem"
    >
      + Add breakpoint
    </button>

    <p :class="STYLES.hint">
      Breakpoints are matched against <code>window.innerWidth</code>: every item
      with <code>maxWidth &gt;= window width</code> matches and the last
      matching one wins — keep them ordered from the widest to the narrowest.
    </p>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import {
  CONFIG_NUMBER_FIELDS,
  EMPTY_FIELD_VALUE,
  addConfigItem,
  removeConfigItem,
  updateConfigItem
} from '@swipi/playground-core'
import type {
  ConfigEditorProps,
  ConfigNumberField
} from '@swipi/playground-core'

const props = defineProps<ConfigEditorProps>()

const emit = defineEmits<{
  (e: 'change', value: ConfigEditorProps['config']): void
}>()

const update = (next: ConfigEditorProps['config']) => {
  emit('change', next)
}

const addItem = (): void => update(addConfigItem(props.config))

const removeItem = (index: number) => (): void =>
  update(removeConfigItem(props.config, index))

const changeNumber =
  (index: number, field: ConfigNumberField) =>
  (event: Event): void => {
    const { value } = event.target as HTMLInputElement
    const parsed = parseFloat(value)

    update(
      updateConfigItem(props.config, index, {
        [field]: Number.isNaN(parsed) ? EMPTY_FIELD_VALUE : parsed
      })
    )
  }

const changeBiasRight =
  (index: number) =>
  (event: Event): void => {
    const { checked } = event.target as HTMLInputElement

    update(updateConfigItem(props.config, index, { biasRight: checked }))
  }
</script>
