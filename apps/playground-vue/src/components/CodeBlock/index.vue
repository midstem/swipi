<template>
  <pre :class="STYLES.code"><span
      v-for="(token, index) in tokens"
      :key="index"
      :class="CODE_TOKEN_STYLES[token.kind]"
    >{{ token.text }}</span></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CODE_TOKEN_STYLES, STYLES, highlight } from '@swipi/playground-core'
import type { CodeBlockProps } from '@swipi/playground-core'

const props = defineProps<CodeBlockProps>()

const tokens = computed(() => highlight(props.code, props.language))
</script>
