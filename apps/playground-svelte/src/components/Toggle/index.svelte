<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import type { ToggleProps } from '@swipi/playground-core'

  let {
    label,
    hint,
    checked,
    disabled = false,
    onChange
  }: ToggleProps = $props()

  const handleChange = (event: Event): void => {
    onChange((event.currentTarget as HTMLInputElement).checked)
  }
</script>

<label class={STYLES.toggle} data-pg="toggle">
  <input
    type="checkbox"
    class={STYLES.checkbox}
    {checked}
    {disabled}
    onchange={handleChange}
  />
  <span class={STYLES.toggleText}>
    <span class={STYLES.label} data-pg="label">{label}</span>
    {#if hint}
      <span class={STYLES.hint}>{hint}</span>
    {/if}
  </span>
</label>
