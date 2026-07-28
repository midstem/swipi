import type { JSX } from 'react'
import { ConfigType } from '../Swipi/types'
import { NEW_CONFIG_ITEM } from './constants'
import { ConfigEditorProps } from './types'

const FIELDS: {
  key: 'maxWidth' | 'slidesNumber' | 'spaceBetween'
  label: string
}[] = [
  { key: 'maxWidth', label: 'maxWidth' },
  { key: 'slidesNumber', label: 'slidesNumber' },
  { key: 'spaceBetween', label: 'spaceBetween' }
]

const ConfigEditor = ({
  config,
  disabled,
  onChange
}: ConfigEditorProps): JSX.Element => {
  const updateItem = (index: number, patch: Partial<ConfigType>): void => {
    onChange(
      config.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  const removeItem = (index: number): void => {
    onChange(config.filter((_, itemIndex) => itemIndex !== index))
  }

  const addItem = (): void => {
    onChange([...config, { ...NEW_CONFIG_ITEM }])
  }

  return (
    <div className={`pg-config${disabled ? ' pg-field--disabled' : ''}`}>
      {config.map((item, index) => (
        <div className="pg-config__item" key={index}>
          <div className="pg-config__grid">
            {FIELDS.map(({ key, label }) => (
              <label className="pg-config__cell" key={key}>
                <span className="pg-hint">{label}</span>
                <input
                  type="number"
                  className="pg-input pg-input--number"
                  min={0}
                  disabled={disabled}
                  value={item[key] ?? 0}
                  onChange={(event) =>
                    updateItem(index, { [key]: Number(event.target.value) })
                  }
                />
              </label>
            ))}
          </div>
          <div className="pg-config__footer">
            <label className="pg-toggle pg-toggle--inline">
              <input
                type="checkbox"
                disabled={disabled}
                checked={Boolean(item.biasRight)}
                onChange={(event) =>
                  updateItem(index, { biasRight: event.target.checked })
                }
              />
              <span className="pg-label">biasRight</span>
            </label>
            <button
              type="button"
              className="pg-button pg-button--ghost"
              disabled={disabled}
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pg-button"
        disabled={disabled}
        onClick={addItem}
      >
        + Add breakpoint
      </button>

      <p className="pg-hint">
        Breakpoints are matched against <code>window.innerWidth</code>: every
        item with <code>maxWidth &gt;= window width</code> matches and the last
        matching one wins — keep them ordered from the widest to the narrowest.
      </p>
    </div>
  )
}

export default ConfigEditor
