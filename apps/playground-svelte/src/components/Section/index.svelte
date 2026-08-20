<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import type { SectionProps } from '../../types'

  const BADGE = {
    hook: 'hook option',
    playground: 'playground only'
  } as const

  let { title, origin, hint, children }: SectionProps = $props()
</script>

<details class={STYLES.section} data-pg="section" data-origin={origin} open>
  <summary class={STYLES.sectionTitle}>
    {title}
    <span class={STYLES.sectionBadge}>{BADGE[origin]}</span>
  </summary>
  <div class={STYLES.sectionBody}>
    {#if hint}
      <p class={STYLES.hint}>{hint}</p>
    {/if}
    {@render children()}
  </div>
</details>
