<template>
  <section :class="STYLES.card">
    <header :class="STYLES.cardHeader">
      <h2 :class="STYLES.cardTitle">Generated code</h2>
      <div :class="STYLES.row">
        <div :class="STYLES.toolbarGroup">
          <span :class="STYLES.toolbarLabel">Markup</span>
          <div :class="STYLES.segmented">
            <button
              v-for="variant in VARIANTS"
              :key="variant.title"
              type="button"
              :class="
                variant.minimal === minimal
                  ? STYLES.segmentActive
                  : STYLES.segment
              "
              :aria-pressed="variant.minimal === minimal"
              @click="minimal = variant.minimal"
            >
              {{ variant.title }}
            </button>
          </div>
        </div>

        <div :class="STYLES.toolbarGroup">
          <span :class="STYLES.toolbarLabel">Styles</span>
          <div :class="STYLES.segmented">
            <button
              v-for="flavour in FLAVOURS"
              :key="flavour.title"
              type="button"
              :class="
                flavour.tailwind === tailwind
                  ? STYLES.segmentActive
                  : STYLES.segment
              "
              :aria-pressed="flavour.tailwind === tailwind"
              @click="tailwind = flavour.tailwind"
            >
              {{ flavour.title }}
            </button>
          </div>
        </div>

        <span :class="STYLES.toolbarDivider" />

        <button type="button" :class="STYLES.button" @click="copy">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </header>

    <p :class="STYLES.hint">
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

    <CodeBlock :code="markup" language="markup" />
    <CodeBlock v-if="styles" :code="styles" language="css" />
  </section>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { ref, computed } from 'vue'
import type { PlaygroundState } from '@swipi/playground-core'
import { buildStyles } from '@swipi/playground-core'
import { buildMarkup } from './helpers'
import CodeBlock from '../CodeBlock/index.vue'

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
