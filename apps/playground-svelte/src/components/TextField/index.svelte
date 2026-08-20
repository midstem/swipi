<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import type { TextFieldProps } from '@swipi/playground-core'

  let { label, hint, value, placeholder, onChange }: TextFieldProps = $props()

  const id = $props.id()

  const handleChange = (event: Event): void => {
    onChange((event.currentTarget as HTMLInputElement).value)
  }
</script>

<div class={STYLES.field} data-pg="field">
  <label class={STYLES.label} data-pg="label" for={id}>
    {label}
  </label>
  <input
    {id}
    type="text"
    class={STYLES.input}
    {value}
    {placeholder}
    onchange={handleChange}
  />
  {#if hint}
    <span class={STYLES.hint}>{hint}</span>
  {/if}
</div>
