<script lang="ts">
  import { buildStyles } from '@swipi/playground-core'
  import type { CodeSnippetProps } from '@swipi/playground-core'
  import { buildMarkup } from './helpers'

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

<section class="pg-card">
  <header class="pg-card__header">
    <h2 class="pg-card__title">Generated code</h2>
    <div class="pg-row">
      <div class="pg-toolbar-group">
        <span class="pg-toolbar-label">Markup</span>
        <div class="pg-segmented">
          {#each VARIANTS as variant (variant.title)}
            <button
              type="button"
              class="pg-segment"
              aria-pressed={variant.minimal === minimal}
              onclick={() => (minimal = variant.minimal)}
            >
              {variant.title}
            </button>
          {/each}
        </div>
      </div>

      <div class="pg-toolbar-group">
        <span class="pg-toolbar-label">Styles</span>
        <div class="pg-segmented">
          {#each FLAVOURS as flavour (flavour.title)}
            <button
              type="button"
              class="pg-segment"
              aria-pressed={flavour.tailwind === tailwind}
              onclick={() => (tailwind = flavour.tailwind)}
            >
              {flavour.title}
            </button>
          {/each}
        </div>
      </div>

      <span class="pg-toolbar-divider"></span>

      <button type="button" class="pg-button" onclick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  </header>

  <p class="pg-hint">
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

  <pre class="pg-code">{markup}</pre>
  {#if styles}
    <pre class="pg-code">{styles}</pre>
  {/if}
</section>
