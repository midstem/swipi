<script lang="ts">
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

  let { config, disabled, onChange }: ConfigEditorProps = $props()

  const addItem = (): void => onChange(addConfigItem(config))

  const removeItem = (index: number) => (): void =>
    onChange(removeConfigItem(config, index))

  const changeNumber =
    (index: number, field: ConfigNumberField) =>
    (event: Event): void => {
      const raw = parseFloat((event.currentTarget as HTMLInputElement).value)

      onChange(
        updateConfigItem(config, index, {
          [field]: Number.isNaN(raw) ? EMPTY_FIELD_VALUE : raw
        })
      )
    }

  const changeBiasRight =
    (index: number) =>
    (event: Event): void => {
      const { checked } = event.currentTarget as HTMLInputElement

      onChange(updateConfigItem(config, index, { biasRight: checked }))
    }
</script>

<div class={STYLES.config} data-pg="config" data-disabled={disabled}>
  {#each config as item, index (index)}
    <div class={STYLES.configItem}>
      <div class={STYLES.configGrid}>
        {#each CONFIG_NUMBER_FIELDS as { key, label } (key)}
          <label class={STYLES.configCell}>
            <span class={STYLES.hint}>{label}</span>
            <input
              type="number"
              class={STYLES.configInput}
              min={EMPTY_FIELD_VALUE}
              {disabled}
              value={item[key] ?? EMPTY_FIELD_VALUE}
              onchange={changeNumber(index, key)}
              oninput={changeNumber(index, key)}
            />
          </label>
        {/each}
      </div>
      <div class={STYLES.configFooter}>
        <label class={STYLES.toggleInline}>
          <input
            type="checkbox"
            {disabled}
            checked={Boolean(item.biasRight)}
            onchange={changeBiasRight(index)}
          />
          <span class={STYLES.label} data-pg="label">biasRight</span>
        </label>
        <button
          type="button"
          class={STYLES.ghostButton}
          {disabled}
          onclick={removeItem(index)}
        >
          Remove
        </button>
      </div>
    </div>
  {/each}

  <button type="button" class={STYLES.button} {disabled} onclick={addItem}>
    + Add breakpoint
  </button>

  <p class={STYLES.hint}>
    Breakpoints are matched against <code>window.innerWidth</code>: every item
    with <code>maxWidth &gt;= window width</code> matches and the last matching one
    wins — keep them ordered from the widest to the narrowest.
  </p>
</div>
