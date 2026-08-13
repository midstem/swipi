import type { JSX } from 'react'
import { JSON_INDENT } from '@swipi/playground-core'
import { ImperativeApiProps } from '@swipi/playground-core'
import { FIRST_INDEX } from './constants'
import { getLastIndex } from './helpers'
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
    <div className="pg-card">
      <h2 className="pg-card__title">Carousel methods</h2>
      <div className="pg-row">
        <button type="button" className="pg-button" onClick={scrollPrev}>
          scrollPrev()
        </button>
        <button type="button" className="pg-button" onClick={scrollNext}>
          scrollNext()
        </button>
        <span className="pg-row__group">
          <input
            type="number"
            className="pg-input pg-input--number"
            aria-label="Slide index for scrollTo"
            min={FIRST_INDEX}
            max={getLastIndex(slidesCount)}
            value={index}
            onChange={changeIndex}
          />
          <button type="button" className="pg-button" onClick={scrollTo}>
            scrollTo(index)
          </button>
        </span>
        <button
          type="button"
          className="pg-button pg-button--ghost"
          onClick={readState}
        >
          Read carousel state
        </button>
      </div>
      {readings && (
        <pre className="pg-code">
          {JSON.stringify(readings, null, JSON_INDENT)}
        </pre>
      )}
    </div>
  )
}

export default ImperativeApi
