import type { JSX } from 'react'
import { STYLES, JSON_INDENT } from '@swipi/playground-core'
import { ImperativeApiProps } from '../../types'
import { FIRST_INDEX, getLastIndex } from '@swipi/playground-core'
import { useImperativeApi } from './useImperativeApi'

const ImperativeApi = ({
  slidesCount,
  swipiRef
}: ImperativeApiProps): JSX.Element => {
  const {
    index,
    readings,
    changeIndex,
    readState,
    scrollPrev,
    scrollNext,
    scrollTo
  } = useImperativeApi({ slidesCount, swipiRef })

  return (
    <div className={STYLES.card}>
      <h2 className={STYLES.cardTitle}>Carousel methods</h2>
      <div className={STYLES.row}>
        <button type="button" className={STYLES.button} onClick={scrollPrev}>
          scrollPrev()
        </button>
        <button type="button" className={STYLES.button} onClick={scrollNext}>
          scrollNext()
        </button>
        <span className={STYLES.rowGroup}>
          <input
            type="number"
            className={STYLES.numberInput}
            aria-label="Slide index for scrollTo"
            min={FIRST_INDEX}
            max={getLastIndex(slidesCount)}
            value={index}
            onChange={changeIndex}
          />
          <button type="button" className={STYLES.button} onClick={scrollTo}>
            scrollTo(index)
          </button>
        </span>
        <button
          type="button"
          className={STYLES.ghostButton}
          onClick={readState}
        >
          Read carousel state
        </button>
      </div>
      {readings && (
        <pre className={STYLES.code}>
          {JSON.stringify(readings, null, JSON_INDENT)}
        </pre>
      )}
    </div>
  )
}

export default ImperativeApi
