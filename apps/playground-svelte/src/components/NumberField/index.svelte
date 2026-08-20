<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import {
    DEFAULT_MAX,
    DEFAULT_MIN,
    DEFAULT_STEP,
    clamp
  } from '@swipi/playground-core'
  import type { NumberFieldProps } from '@swipi/playground-core'

  let {
    label,
    hint,
    value,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    step = DEFAULT_STEP,
    withSlider = true,
    disabled = false,
    onChange
  }: NumberFieldProps = $props()

  const id = $props.id()

  const handleChange = (event: Event): void => {
    const raw = parseFloat((event.currentTarget as HTMLInputElement).value)
    const next = Number.isNaN(raw) ? min : raw

    onChange(clamp(next, min, max))
  }
</script>

<div class={STYLES.field} data-pg="field" data-disabled={disabled}>
  <label class={STYLES.label} data-pg="label" for={id}>
    {label}
  </label>
  <div class={STYLES.fieldRow}>
    {#if withSlider}
      <input
        type="range"
        {min}
        {max}
        {step}
        {value}
        {disabled}
        onchange={handleChange}
        oninput={handleChange}
      />
    {/if}
    <input
      {id}
      type="number"
      class={STYLES.numberInput}
      {min}
      {max}
      {step}
      {value}
      {disabled}
      onchange={handleChange}
      oninput={handleChange}
    />
  </div>
  {#if hint}
    <span class={STYLES.hint}>{hint}</span>
  {/if}
</div>
