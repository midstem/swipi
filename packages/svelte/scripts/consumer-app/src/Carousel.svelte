<script>
  import { useSwipiCarousel } from '@midstem/swipi-svelte'

  const SLIDES = ['one', 'two', 'three', 'four']

  const SLIDE_WIDTH = 300

  const [carouselRef, carousel] = useSwipiCarousel({ slideWidth: SLIDE_WIDTH })
</script>

<section>
  <div id="viewport" use:carouselRef>
    <div id="track">
      {#each SLIDES as slide (slide)}
        <article>{slide}</article>
      {/each}
    </div>
  </div>

  <button id="next" on:click={() => $carousel.scrollNext()}>next</button>

  <p id="state">
    {`${$carousel.selectedIndex}/${$carousel.snapCount}/${$carousel.slidesCount}`}
  </p>
</section>
