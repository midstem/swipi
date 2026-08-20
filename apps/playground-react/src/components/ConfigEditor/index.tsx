import type { JSX } from 'react'
import { STYLES, ConfigEditorProps } from '@swipi/playground-core'
import { CONFIG_NUMBER_FIELDS, EMPTY_FIELD_VALUE } from '@swipi/playground-core'
import { useConfigEditor } from './useConfigEditor'

const ConfigEditor = ({
  config,
  disabled,
  onChange
}: ConfigEditorProps): JSX.Element => {
  const { addItem, removeItem, changeNumber, changeBiasRight } =
    useConfigEditor({ config, disabled, onChange })

  return (
    <div className={STYLES.config} data-pg="config" data-disabled={disabled}>
      {config.map((item, index) => (
        <div className={STYLES.configItem} key={index}>
          <div className={STYLES.configGrid}>
            {CONFIG_NUMBER_FIELDS.map(({ key, label }) => (
              <label className={STYLES.configCell} key={key}>
                <span className={STYLES.hint}>{label}</span>
                <input
                  type="number"
                  className={STYLES.configInput}
                  min={EMPTY_FIELD_VALUE}
                  disabled={disabled}
                  value={item[key] ?? EMPTY_FIELD_VALUE}
                  onChange={changeNumber(index, key)}
                />
              </label>
            ))}
          </div>
          <div className={STYLES.configFooter}>
            <label className={STYLES.toggleInline}>
              <input
                type="checkbox"
                className={STYLES.checkbox}
                disabled={disabled}
                checked={Boolean(item.biasRight)}
                onChange={changeBiasRight(index)}
              />
              <span className={STYLES.label} data-pg="label">
                biasRight
              </span>
            </label>
            <button
              type="button"
              className={STYLES.ghostButton}
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
        className={STYLES.button}
        disabled={disabled}
        onClick={addItem}
      >
        + Add breakpoint
      </button>

      <p className={STYLES.hint}>
        Breakpoints are matched against <code>window.innerWidth</code>: every
        item with <code>maxWidth &gt;= window width</code> matches and the last
        matching one wins — keep them ordered from the widest to the narrowest.
      </p>
    </div>
  )
}

export default ConfigEditor
