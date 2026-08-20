<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import { buildStyles } from '@swipi/playground-core'
  import type { CodeSnippetProps } from '@swipi/playground-core'
  import { buildMarkup } from './helpers'
  import CodeBlock from '../CodeBlock/index.svelte'

  const COPIED_TIMEOUT = 1500

  const VARIANTS = [
    { minimal: false, title: 'Accessible' },
    { minimal: true, title: 'Minimal' }
  ]

  const FLAVOURS = [
    { tailwind: true, title: 'Tailwind' },
    { tailwind: false, title: 'CSS' }
  ]

  let { state: playgroundState }: CodeSnippetProps = $props()

  let copied = $state(false)
  let minimal = $state(true)
  let tailwind = $state(true)

  const markup = $derived(buildMarkup(playgroundState, minimal, tailwind))
  const styles = $derived(tailwind ? '' : buildStyles(playgroundState, minimal))

  const copy = (): void => {
    const source = styles ? `${markup}\n\n/* CSS */\n${styles}` : markup

    void navigator.clipboard.writeText(source)
    copied = true
    setTimeout(() => {
      copied = false
    }, COPIED_TIMEOUT)
  }
</script>

<section class={STYLES.card}>
  <header class={STYLES.cardHeader}>
    <h2 class={STYLES.cardTitle}>Generated code</h2>
    <div class={STYLES.row}>
      <div class={STYLES.toolbarGroup}>
        <span class={STYLES.toolbarLabel}>Markup</span>
        <div class={STYLES.segmented}>
          {#each VARIANTS as variant (variant.title)}
            <button
              type="button"
              class={variant.minimal === minimal
                ? STYLES.segmentActive
                : STYLES.segment}
              aria-pressed={variant.minimal === minimal}
              onclick={() => (minimal = variant.minimal)}
            >
              {variant.title}
            </button>
          {/each}
        </div>
      </div>

      <div class={STYLES.toolbarGroup}>
        <span class={STYLES.toolbarLabel}>Styles</span>
        <div class={STYLES.segmented}>
          {#each FLAVOURS as flavour (flavour.title)}
            <button
              type="button"
              class={flavour.tailwind === tailwind
                ? STYLES.segmentActive
                : STYLES.segment}
              aria-pressed={flavour.tailwind === tailwind}
              onclick={() => (tailwind = flavour.tailwind)}
            >
              {flavour.title}
            </button>
          {/each}
        </div>
      </div>

      <span class={STYLES.toolbarDivider}></span>

      <button type="button" class={STYLES.button} onclick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  </header>

  <p class={STYLES.hint}>
    {#if minimal}
      The same carousel with everything optional taken off: no roles, no labels,
      no live region, no arrow keys — the layout as
      {tailwind ? 'Tailwind classes' : 'CSS'}. Shortest thing that works; reach
      for the accessible variant before you ship.
    {:else}
      Everything the current settings need: the hook options, the accessible
      markup around them, the rest as {tailwind ? 'Tailwind classes' : 'CSS'}.
      The roles, labels and the live region are yours to edit and translate once
      you paste this.
    {/if}
  </p>

  <CodeBlock code={markup} language="markup" />
  {#if styles}
    <CodeBlock code={styles} language="css" />
  {/if}
</section>
