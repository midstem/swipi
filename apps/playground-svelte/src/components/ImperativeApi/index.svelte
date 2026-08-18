<script lang="ts">
  import {
    FIRST_INDEX,
    JSON_INDENT,
    clampIndex,
    getLastIndex
  } from '@swipi/playground-core'
  import type { ImperativeReadings } from '@swipi/playground-core'
  import type { ImperativeApiProps } from '../../types'

  let { carousel, slidesCount }: ImperativeApiProps = $props()

  let index = $state(FIRST_INDEX)
  let readings = $state<ImperativeReadings | undefined>(undefined)

  const changeIndex = (event: Event): void => {
    const { value } = event.currentTarget as HTMLInputElement

    index = clampIndex(parseInt(value, 10), slidesCount)
  }

  const scrollPrev = (): void => carousel?.scrollPrev()

  const scrollNext = (): void => carousel?.scrollNext()

  const scrollTo = (): void => carousel?.scrollTo(index)

  const readState = (): void => {
    if (!carousel) return

    readings = {
      canScrollNext: carousel.canScrollNext(),
      canScrollPrev: carousel.canScrollPrev(),
      scrollSnapList: carousel.scrollSnapList(),
      selectedScrollSnap: carousel.selectedScrollSnap()
    }
  }
</script>

<div class="pg-card">
  <h2 class="pg-card__title">Carousel methods</h2>
  <div class="pg-row">
    <button type="button" class="pg-button" onclick={scrollPrev}>
      scrollPrev()
    </button>
    <button type="button" class="pg-button" onclick={scrollNext}>
      scrollNext()
    </button>
    <span class="pg-row__group">
      <input
        type="number"
        class="pg-input pg-input--number"
        aria-label="Slide index for scrollTo"
        min={FIRST_INDEX}
        max={getLastIndex(slidesCount)}
        value={index}
        onchange={changeIndex}
        oninput={changeIndex}
      />
      <button type="button" class="pg-button" onclick={scrollTo}>
        scrollTo(index)
      </button>
    </span>
    <button
      type="button"
      class="pg-button pg-button--ghost"
      onclick={readState}
    >
      Read carousel state
    </button>
  </div>
  {#if readings}
    <pre class="pg-code">{JSON.stringify(readings, null, JSON_INDENT)}</pre>
  {/if}
</div>
