import {
  FIRST_INDEX,
  JSON_INDENT,
  clampIndex,
  getLastIndex
} from '@swipi/playground-core'
import type { ImperativeReadings } from '@swipi/playground-core'
import { element, setAttributes, setText } from '../../dom'
import type { Component, ImperativeApiProps } from '../../types'

export const createImperativeApi = (
  props: ImperativeApiProps
): Component<ImperativeApiProps> => {
  let current = props
  let index = FIRST_INDEX

  const input = element('input', {
    type: 'number',
    class: 'pg-input pg-input--number',
    'aria-label': 'Slide index for scrollTo',
    min: FIRST_INDEX,
    value: index
  })

  const handleIndex = (): void => {
    index = clampIndex(parseInt(input.value, 10), current.slidesCount)
  }

  input.addEventListener('input', handleIndex)
  input.addEventListener('change', handleIndex)

  const readings = element('pre', { class: 'pg-code', hidden: true })

  const button = (
    label: string,
    onClick: () => void,
    ghost = false
  ): HTMLElement => {
    const node = element('button', {
      type: 'button',
      class: ghost ? 'pg-button pg-button--ghost' : 'pg-button'
    })

    node.textContent = label
    node.addEventListener('click', onClick)

    return node
  }

  const readState = (): void => {
    const { carousel } = current

    if (!carousel) return

    const values: ImperativeReadings = {
      canScrollNext: carousel.canScrollNext(),
      canScrollPrev: carousel.canScrollPrev(),
      scrollSnapList: carousel.scrollSnapList(),
      selectedScrollSnap: carousel.selectedScrollSnap()
    }

    readings.hidden = false
    setText(readings, JSON.stringify(values, null, JSON_INDENT))
  }

  const card = element('div', { class: 'pg-card' }, [
    element('h2', { class: 'pg-card__title' }, ['Carousel methods']),
    element('div', { class: 'pg-row' }, [
      button('scrollPrev()', () => current.carousel?.scrollPrev()),
      button('scrollNext()', () => current.carousel?.scrollNext()),
      element('span', { class: 'pg-row__group' }, [
        input,
        button('scrollTo(index)', () => current.carousel?.scrollTo(index))
      ]),
      button('Read carousel state', readState, true)
    ]),
    readings
  ])

  return {
    element: card,
    update: (next) => {
      current = next

      index = clampIndex(index, next.slidesCount)

      setAttributes(input, { max: getLastIndex(next.slidesCount) })

      if (input.value !== String(index)) input.value = String(index)
    }
  }
}
