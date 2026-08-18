<script lang="ts">
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

<div class="pg-field" class:pg-field--disabled={disabled}>
  <label class="pg-label" for={id}>
    {label}
  </label>
  <div class="pg-field__row">
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
      class="pg-input pg-input--number"
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
    <span class="pg-hint">{hint}</span>
  {/if}
</div>
