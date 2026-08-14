<template>
  <section class="pg-card">
    <header class="pg-card__header">
      <h2 class="pg-card__title">Generated code</h2>
      <div class="pg-row">
        <div class="pg-toolbar-group">
          <span class="pg-toolbar-label">Markup</span>
          <div class="pg-segmented">
            <button
              v-for="variant in VARIANTS"
              :key="variant.title"
              type="button"
              class="pg-segment"
              :aria-pressed="variant.minimal === minimal"
              @click="minimal = variant.minimal"
            >
              {{ variant.title }}
            </button>
          </div>
        </div>

        <div class="pg-toolbar-group">
          <span class="pg-toolbar-label">Styles</span>
          <div class="pg-segmented">
            <button
              v-for="flavour in FLAVOURS"
              :key="flavour.title"
              type="button"
              class="pg-segment"
              :aria-pressed="flavour.tailwind === tailwind"
              @click="tailwind = flavour.tailwind"
            >
              {{ flavour.title }}
            </button>
          </div>
        </div>

        <span class="pg-toolbar-divider" />

        <button type="button" class="pg-button" @click="copy">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </header>

    <p class="pg-hint">
      <template v-if="minimal">
        The same carousel with everything optional taken off: no roles, no
        labels, no live region, no arrow keys — the layout as
        {{ tailwind ? 'Tailwind classes' : 'CSS' }}. Shortest thing that works;
        reach for the accessible variant before you ship.
      </template>
      <template v-else>
        Everything the current settings need: the hook options, the accessible
        markup around them, the rest as
        {{ tailwind ? 'Tailwind classes' : 'CSS' }}. The roles, labels and the
        live region are yours to edit and translate once you paste this.
      </template>
    </p>

    <pre class="pg-code">{{ markup }}</pre>
    <pre v-if="styles" class="pg-code">{{ styles }}</pre>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlaygroundState } from '@swipi/playground-core'
import { buildStyles } from '@swipi/playground-core'
import { buildMarkup } from './helpers'

const props = defineProps<{
  state: PlaygroundState
}>()

const COPIED_TIMEOUT = 1500

const VARIANTS = [
  { minimal: false, title: 'Accessible' },
  { minimal: true, title: 'Minimal' }
]

const FLAVOURS = [
  { tailwind: true, title: 'Tailwind' },
  { tailwind: false, title: 'CSS' }
]

const copied = ref(false)
const minimal = ref(true)
const tailwind = ref(true)

const markup = computed(() =>
  buildMarkup(props.state, minimal.value, tailwind.value)
)

const styles = computed(() =>
  tailwind.value ? '' : buildStyles(props.state, minimal.value)
)

const copy = (): void => {
  const source = styles.value
    ? `${markup.value}\n\n/* CSS */\n${styles.value}`
    : markup.value

  void navigator.clipboard.writeText(source)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, COPIED_TIMEOUT)
}
</script>
