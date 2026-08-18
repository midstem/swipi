<script lang="ts">
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

<label class="pg-toggle">
  <input type="checkbox" {checked} {disabled} onchange={handleChange} />
  <span class="pg-toggle__text">
    <span class="pg-label">{label}</span>
    {#if hint}
      <span class="pg-hint">{hint}</span>
    {/if}
  </span>
</label>
