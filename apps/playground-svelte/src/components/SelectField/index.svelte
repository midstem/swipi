<script lang="ts" generics="Value extends string">
  import { STYLES } from '@swipi/playground-core'
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

<div class={STYLES.field} data-pg="field">
  <label class={STYLES.label} data-pg="label" for={id}>
    {label}
  </label>
  <select {id} class={STYLES.select} {value} onchange={handleChange}>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if hint}
    <span class={STYLES.hint}>{hint}</span>
  {/if}
</div>
