import type { JSX } from 'react'
import { ConfigEditorProps } from '@swipi/playground-core'
import { CONFIG_NUMBER_FIELDS, EMPTY_FIELD_VALUE } from './constants'
import { useConfigEditor } from './useConfigEditor'

const ConfigEditor = ({
  config,
  disabled,
  onChange
}: ConfigEditorProps): JSX.Element => {
  const { addItem, removeItem, changeNumber, changeBiasRight } =
    useConfigEditor({ config, disabled, onChange })

  return (
    <div className={`pg-config${disabled ? ' pg-field--disabled' : ''}`}>
      {config.map((item, index) => (
        <div className="pg-config__item" key={index}>
          <div className="pg-config__grid">
            {CONFIG_NUMBER_FIELDS.map(({ key, label }) => (
              <label className="pg-config__cell" key={key}>
                <span className="pg-hint">{label}</span>
                <input
                  type="number"
                  className="pg-input pg-input--number"
                  min={EMPTY_FIELD_VALUE}
                  disabled={disabled}
                  value={item[key] ?? EMPTY_FIELD_VALUE}
                  onChange={changeNumber(index, key)}
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
                onChange={changeBiasRight(index)}
              />
              <span className="pg-label">biasRight</span>
            </label>
            <button
              type="button"
              className="pg-button pg-button--ghost"
              disabled={disabled}
              onClick={removeItem(index)}
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
