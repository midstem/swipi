<script lang="ts">
  import type { TextFieldProps } from '@swipi/playground-core'

  let { label, hint, value, placeholder, onChange }: TextFieldProps = $props()

  const id = $props.id()

  const handleChange = (event: Event): void => {
    onChange((event.currentTarget as HTMLInputElement).value)
  }
</script>

<div class="pg-field">
  <label class="pg-label" for={id}>
    {label}
  </label>
  <input
    {id}
    type="text"
    class="pg-input"
    {value}
    {placeholder}
    onchange={handleChange}
  />
  {#if hint}
    <span class="pg-hint">{hint}</span>
  {/if}
</div>
