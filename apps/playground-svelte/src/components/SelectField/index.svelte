<script lang="ts" generics="Value extends string">
  import type { SelectFieldProps } from '@swipi/playground-core'

  let { label, hint, value, options, onChange }: SelectFieldProps<Value> =
    $props()

  const id = $props.id()

  const handleChange = (event: Event): void => {
    const { value: selected } = event.currentTarget as HTMLSelectElement & {
      value: Value
    }

    onChange(selected)
  }
</script>

<div class="pg-field">
  <label class="pg-label" for={id}>
    {label}
  </label>
  <select {id} class="pg-input" {value} onchange={handleChange}>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if hint}
    <span class="pg-hint">{hint}</span>
  {/if}
</div>
