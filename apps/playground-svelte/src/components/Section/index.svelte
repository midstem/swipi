<script lang="ts">
  import type { SectionProps } from '../../types'

  const BADGE = {
    hook: 'hook option',
    playground: 'playground only'
  } as const

  let { title, origin, hint, children }: SectionProps = $props()
</script>

<details class="pg-section pg-section--{origin}" open>
  <summary class="pg-section__title">
    {title}
    <span class="pg-section__badge">{BADGE[origin]}</span>
  </summary>
  <div class="pg-section__body">
    {#if hint}
      <p class="pg-hint">{hint}</p>
    {/if}
    {@render children()}
  </div>
</details>
