import { describe, expect, it } from 'vitest'
import { CodeToken, CodeTokenKind } from '../types'
import { highlight } from './index'

const toSource = (tokens: CodeToken[]): string =>
  tokens.map(({ text }) => text).join('')

const kindOf = (tokens: CodeToken[], text: string): CodeTokenKind | undefined =>
  tokens.find((token) => token.text.trim() === text)?.kind

const kindsOf = (tokens: CodeToken[], text: string): CodeTokenKind[] =>
  tokens
    .filter((token) => token.text.trim() === text)
    .map((token) => token.kind)

const JSX = `import { useSwipiCarousel } from '@midstem/swipi-react'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

  return (
    <>
      <div className="carousel__viewport" ref={carouselRef}>
        {items.map((item) => (
          <div className="carousel__slide" key={item.id}>
            {item.title}
          </div>
        ))}
      </div>
    </>
  )
}`

const VUE = `<template>
  <div :ref="carouselRef" class="carousel__viewport">
    <div v-for="(item, index) in items" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>

<script setup>
import { useSwipiCarousel } from '@midstem/swipi-vue'

const [carouselRef, carousel] = useSwipiCarousel({ loop: true })
</script>`

const SVELTE = `<script>
  let { items } = $props()
</script>

<div use:carouselRef class="carousel__viewport">
  {#each items as item (item.id)}
    <div class="carousel__slide">{item.title}</div>
  {/each}
</div>`

const ANGULAR = `import { Component } from '@angular/core'

@Component({
  selector: 'app-carousel',
  template: \`
    <div #viewport class="carousel__viewport">
      @for (item of items(); track item.id) {
        <div class="carousel__slide">{{ item.title }}</div>
      }
    </div>
  \`
})
export class CarouselComponent {}`

const CSS = `.carousel__viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__slide[data-selected='true'] {
  opacity: 1;
  transition: opacity 350ms cubic-bezier(0.25, 1, 0.5, 1);
}`

describe('highlight', () => {
  it('keeps the source intact', () => {
    expect(toSource(highlight(JSX, 'jsx'))).toBe(JSX)
    expect(toSource(highlight(VUE, 'markup'))).toBe(VUE)
    expect(toSource(highlight(SVELTE, 'markup'))).toBe(SVELTE)
    expect(toSource(highlight(ANGULAR, 'typescript'))).toBe(ANGULAR)
    expect(toSource(highlight(CSS, 'css'))).toBe(CSS)
  })

  it('reads jsx as markup inside code', () => {
    const tokens = highlight(JSX, 'jsx')

    expect(kindOf(tokens, 'import')).toBe('keyword')
    expect(kindOf(tokens, "'@midstem/swipi-react'")).toBe('string')
    expect(kindOf(tokens, 'div')).toBe('tag')
    expect(kindOf(tokens, 'className')).toBe('attribute')
    expect(kindOf(tokens, '"carousel__viewport"')).toBe('string')
    expect(kindsOf(tokens, 'useSwipiCarousel')).toContain('function')
  })

  it('reads a single file component as markup with a script', () => {
    const tokens = highlight(VUE, 'markup')

    expect(kindOf(tokens, 'template')).toBe('tag')
    expect(kindOf(tokens, 'v-for')).toBe('attribute')
    expect(kindOf(tokens, 'const')).toBe('keyword')
    expect(kindOf(tokens, "'@midstem/swipi-vue'")).toBe('string')
  })

  it('reads svelte blocks and expressions', () => {
    const tokens = highlight(SVELTE, 'markup')

    expect(kindOf(tokens, 'use:carouselRef')).toBe('attribute')
    expect(kindOf(tokens, 'as')).toBe('keyword')
    expect(kindOf(tokens, '$props')).toBe('function')
  })

  it('reads an angular template literal as markup', () => {
    const tokens = highlight(ANGULAR, 'typescript')

    expect(kindOf(tokens, '@for')).toBe('keyword')
    expect(kindOf(tokens, '#viewport')).toBe('attribute')
    expect(kindOf(tokens, 'class')).toBe('attribute')
  })

  it('reads selectors, properties and values', () => {
    const tokens = highlight(CSS, 'css')

    expect(kindOf(tokens, 'overflow')).toBe('property')
    expect(kindOf(tokens, 'hidden')).toBe('plain')
    expect(kindOf(tokens, '350ms')).toBe('number')
    expect(kindOf(tokens, "'true'")).toBe('string')
  })
})
