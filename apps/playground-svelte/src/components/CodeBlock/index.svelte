<script lang="ts">
  import { CODE_TOKEN_STYLES, STYLES, highlight } from '@swipi/playground-core'
  import type { CodeBlockProps } from '@swipi/playground-core'

  let { code, language }: CodeBlockProps = $props()

  const tokens = $derived(highlight(code, language))
</script>

<pre class={STYLES.code}>{#each tokens as token, index (index)}<span
      class={CODE_TOKEN_STYLES[token.kind]}>{token.text}</span
    >{/each}</pre>
