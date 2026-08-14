import { ChangeEvent, useState } from 'react'
import { ImperativeReadings } from '@swipi/playground-core'
import { UseImperativeApiProps, UseImperativeApiReturn } from '../../types'
import { FIRST_INDEX, clampIndex } from '@swipi/playground-core'

export const useImperativeApi = ({
  slidesCount,
  swipiRef
}: UseImperativeApiProps): UseImperativeApiReturn => {
  const [index, setIndex] = useState<number>(FIRST_INDEX)
  const [readings, setReadings] = useState<ImperativeReadings>()

  const changeIndex = (event: ChangeEvent<HTMLInputElement>): void =>
    setIndex(clampIndex(Number(event.target.value), slidesCount))

  const readState = (): void => {
    const swipi = swipiRef.current

    if (!swipi) return

    setReadings({
      selectedScrollSnap: swipi.selectedScrollSnap(),
      scrollSnapList: swipi.scrollSnapList(),
      canScrollNext: swipi.canScrollNext(),
      canScrollPrev: swipi.canScrollPrev()
    })
  }

  return {
    index,
    readings,
    changeIndex,
    readState,
    scrollPrev: () => swipiRef.current?.scrollPrev(),
    scrollNext: () => swipiRef.current?.scrollNext(),
    scrollTo: () => swipiRef.current?.scrollTo(index)
  }
}
