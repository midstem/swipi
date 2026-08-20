<script lang="ts">
  import { STYLES } from '@swipi/playground-core'
  import { onMount, untrack } from 'svelte'
  import { writable } from 'svelte/store'
  import { useSwipiCarousel } from '@midstem/swipi-svelte'
  import type { SwipiCarouselOptions } from '@midstem/swipi-svelte'
  import {
    VERTICAL_AXIS,
    getActiveBreakpoint,
    getArrows,
    getBias,
    getConfig,
    getSlideStyle,
    getSlideWidth,
    getSpaceBetween,
    getTrackStyle,
    getViewportStyle,
    getVisibleSlides,
    isNextKey,
    isPreviousKey
  } from '@swipi/playground-core'
  import { toRange, toStyle } from '../../helpers'
  import type { StageProps } from '../../types'

  let {
    state: playgroundState,
    slides,
    onSelect,
    onChange,
    onReady
  }: StageProps = $props()

  let windowWidth = $state(window.innerWidth)

  const config = $derived(getConfig(playgroundState))
  const activeBreakpoint = $derived(getActiveBreakpoint(config, windowWidth))
  const isVertical = $derived(playgroundState.axis === VERTICAL_AXIS)
  const visibleSlides = $derived(
    getVisibleSlides(playgroundState, config, windowWidth)
  )
  const bias = $derived(
    getBias(playgroundState, config, windowWidth, visibleSlides)
  )
  const slideWidth = $derived(getSlideWidth(playgroundState))
  const spaceBetween = $derived(
    getSpaceBetween(playgroundState, config, windowWidth)
  )

  const options: SwipiCarouselOptions = $derived({
    axis: playgroundState.axis,
    loop: playgroundState.loop,
    dragFree: playgroundState.dragFree,
    autoplay: playgroundState.autoplay,
    startIndex: playgroundState.startIndex,
    autoplaySpeed: playgroundState.autoplaySpeed,
    animationSpeed: playgroundState.animationSpeed,
    respectReducedMotion: playgroundState.respectReducedMotion,
    slideWidth,
    spaceBetween,
    onSelect,
    onChange
  })

  const optionsStore = writable(untrack(() => options))

  $effect(() => optionsStore.set(options))

  const [carouselRef, carousel] = useSwipiCarousel(optionsStore)

  const showArrows = $derived(
    playgroundState.showArrows && $carousel.hasOverflow
  )
  const arrows = $derived(getArrows(isVertical))
  const dots = $derived(toRange($carousel.snapCount))

  const handleResize = (): void => {
    windowWidth = window.innerWidth
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (isPreviousKey(event.key, isVertical)) $carousel.scrollPrev()
    if (isNextKey(event.key, isVertical)) $carousel.scrollNext()
  }

  onMount(() => {
    onReady({
      scrollNext: () => $carousel.scrollNext(),
      scrollPrev: () => $carousel.scrollPrev(),
      scrollTo: (index: number) => $carousel.scrollTo(index),
      selectedScrollSnap: () => $carousel.selectedIndex,
      scrollSnapList: () => toRange($carousel.snapCount),
      canScrollNext: () => $carousel.canScrollNext,
      canScrollPrev: () => $carousel.canScrollPrev
    })
  })
</script>

<svelte:window onresize={handleResize} />

<div class={STYLES.card}>
  <div class={STYLES.slider} style="width: {playgroundState.stageWidth}px">
    <div class={STYLES.carousel} data-pg="carousel">
      <span class={STYLES.visuallyHidden} aria-live="polite" aria-atomic="true">
        Slide {$carousel.selectedIndex + 1} of {$carousel.snapCount}
      </span>

      <div class={STYLES.carouselRow} data-axis={playgroundState.axis}>
        {#if showArrows}
          <button
            type="button"
            class={STYLES.arrow}
            aria-label="Previous slide"
            disabled={!$carousel.canScrollPrev}
            onclick={() => $carousel.scrollPrev()}
          >
            {arrows[0]}
          </button>
        {/if}

        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div
          use:carouselRef
          class={STYLES.viewport}
          data-pg="viewport"
          data-axis={playgroundState.axis}
          style={toStyle(getViewportStyle(playgroundState, isVertical))}
          role="group"
          tabindex="0"
          aria-roledescription="carousel"
          aria-label={playgroundState.ariaLabel}
          onkeydown={handleKeyDown}
        >
          <div
            class={STYLES.track}
            data-axis={playgroundState.axis}
            style={toStyle(getTrackStyle(visibleSlides, bias, slideWidth))}
          >
            {#each slides as color, index (color)}
              <div
                class={STYLES.slide}
                data-pg="slide"
                data-axis={playgroundState.axis}
                role="group"
                aria-roledescription="slide"
                aria-label="{index + 1} of {slides.length}"
                style={toStyle(
                  getSlideStyle(
                    playgroundState,
                    index === $carousel.selectedIndex
                  )
                )}
              >
                <div class={STYLES.slideBox} style="background-color: {color}">
                  {index + 1}
                </div>
              </div>
            {/each}
          </div>
        </div>

        {#if showArrows}
          <button
            type="button"
            class={STYLES.arrow}
            aria-label="Next slide"
            disabled={!$carousel.canScrollNext}
            onclick={() => $carousel.scrollNext()}
          >
            {arrows[1]}
          </button>
        {/if}
      </div>

      {#if playgroundState.showDots}
        <nav class={STYLES.dots}>
          {#each dots as index (index)}
            <button
              type="button"
              class={STYLES.dot}
              aria-label="Go to slide {index + 1}"
              aria-current={index === $carousel.selectedIndex}
              onclick={() => $carousel.scrollTo(index)}
            >
              <span
                class={STYLES.dotMark}
                data-active={index === $carousel.selectedIndex}
                style="transition: {playgroundState.animationSpeed}ms"
              ></span>
            </button>
          {/each}
        </nav>
      {/if}
    </div>
  </div>

  <ul class={STYLES.facts}>
    <li>
      window width: <b>{windowWidth}px</b>
    </li>
    <li>
      visible slides: <b>{visibleSlides}</b>
    </li>
    <li>
      snap positions: <b>{$carousel.snapCount}</b>
    </li>
    <li>
      active breakpoint:
      <b>
        {activeBreakpoint ? `maxWidth ${activeBreakpoint.maxWidth}` : 'none'}
      </b>
    </li>
  </ul>

  {#if !$carousel.hasOverflow}
    <p class={STYLES.warning}>
      All slides fit on the screen, so arrows, dots navigation and
      <code>loop</code> are disabled — add more slides, decrease
      <code>slidesNumber</code> or narrow the stage.
    </p>
  {/if}
</div>
