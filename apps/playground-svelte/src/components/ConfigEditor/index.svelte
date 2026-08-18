<script lang="ts">
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

<div class="pg-config" class:pg-field--disabled={disabled}>
  {#each config as item, index (index)}
    <div class="pg-config__item">
      <div class="pg-config__grid">
        {#each CONFIG_NUMBER_FIELDS as { key, label } (key)}
          <label class="pg-config__cell">
            <span class="pg-hint">{label}</span>
            <input
              type="number"
              class="pg-input pg-input--number"
              min={EMPTY_FIELD_VALUE}
              {disabled}
              value={item[key] ?? EMPTY_FIELD_VALUE}
              onchange={changeNumber(index, key)}
              oninput={changeNumber(index, key)}
            />
          </label>
        {/each}
      </div>
      <div class="pg-config__footer">
        <label class="pg-toggle pg-toggle--inline">
          <input
            type="checkbox"
            {disabled}
            checked={Boolean(item.biasRight)}
            onchange={changeBiasRight(index)}
          />
          <span class="pg-label">biasRight</span>
        </label>
        <button
          type="button"
          class="pg-button pg-button--ghost"
          {disabled}
          onclick={removeItem(index)}
        >
          Remove
        </button>
      </div>
    </div>
  {/each}

  <button type="button" class="pg-button" {disabled} onclick={addItem}>
    + Add breakpoint
  </button>

  <p class="pg-hint">
    Breakpoints are matched against <code>window.innerWidth</code>: every item
    with <code>maxWidth &gt;= window width</code> matches and the last matching one
    wins — keep them ordered from the widest to the narrowest.
  </p>
</div>
