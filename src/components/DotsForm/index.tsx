import { DotsFormProps } from './types'
import {
  Form,
  Legend,
  Fieldset,
  BooleanValue,
  Field,
  TextInput
} from './styles'
import { ChangeEvent, FormEvent } from 'react'

const DotsForm = ({
  showDots,
  sizeForDefaultDot,
  dotsAnimationText,
  customDot,
  customActiveDot,
  setShowDots,
  setSizeForDefaultDot,
  setSizeForDefaultActiveDot,
  setDotColor,
  setActiveDotColor,
  setDotsAnimation,
  setDotsAnimationText,
  setCustomDot,
  setCustomActiveDot
}: DotsFormProps) => {
  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDotsAnimation(dotsAnimationText)
  }

  const handleTextInput = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: (a: string) => void
  ) => {
    const trimmedString = e.target.value.replace(/\s/g, '')
    setValue(trimmedString)
  }

  return (
    <Form onSubmit={handleOnSubmit}>
      <Fieldset>
        <Legend>Dots</Legend>
        <BooleanValue>
          <p>showDots</p>
          <div>
            <label>
              <input
                type="radio"
                name="showDots"
                checked={showDots}
                onChange={() => setShowDots(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="showDots"
                checked={!showDots}
                onChange={() => setShowDots(false)}
              />
              No
            </label>
          </div>
        </BooleanValue>
        <Field>
          <div>
            <label htmlFor="sizeForDefaultDot">sizeForDefaultDot</label>
            <TextInput
              id="sizeForDefaultDot"
              type="number"
              placeholder="12"
              onChange={(e) => {
                console.log(sizeForDefaultDot)
                setSizeForDefaultDot(+e.target.value)
              }}
            />
          </div>
          <div>
            <label htmlFor="sizeForDefaultActiveDot">
              sizeForDefaultActiveDot
            </label>
            <TextInput
              id="sizeForDefaultActiveDot"
              type="number"
              placeholder="12"
              onChange={(e) => setSizeForDefaultActiveDot(+e.target.value)}
            />
          </div>
        </Field>
        <Field>
          <div>
            <label htmlFor="dotColor">dotColor</label>
            <TextInput
              id="dotColor"
              type="text"
              placeholder="#c7c7c7"
              onChange={(e) => handleTextInput(e, setDotColor)}
            />
          </div>
          <div>
            <label htmlFor="activeDotColor">activeDotColor</label>
            <TextInput
              id="activeDotColor"
              type="text"
              placeholder="#000000"
              onChange={(e) => setActiveDotColor(e.target.value)}
            />
          </div>
        </Field>
        <Field>
          <BooleanValue>
            <p>customDot</p>
            <div>
              <label>
                <input
                  type="radio"
                  name="customDot"
                  value="circle"
                  checked={customDot === 'circle'}
                  onChange={(e) => setCustomDot(e.target.value)}
                />
                Custom circle
              </label>
              <label>
                <input
                  type="radio"
                  name="customDot"
                  value="unicorn"
                  checked={customDot === 'unicorn'}
                  onChange={(e) => setCustomDot(e.target.value)}
                />
                Unicorn
              </label>
              <label>
                <input
                  type="radio"
                  name="customDot"
                  value="none"
                  checked={customDot === 'none'}
                  onChange={(e) => setCustomDot(e.target.value)}
                />
                None
              </label>
            </div>
          </BooleanValue>
          <BooleanValue>
            <p>customActiveDot</p>
            <div>
              <label>
                <input
                  type="radio"
                  name="customActiveDot"
                  value="active-circle"
                  checked={customActiveDot === 'active-circle'}
                  onChange={(e) => setCustomActiveDot(e.target.value)}
                />
                Custom active circle
              </label>
              <label>
                <input
                  type="radio"
                  name="customActiveDot"
                  value="red-unicorn"
                  checked={customActiveDot === 'red-unicorn'}
                  onChange={(e) => setCustomActiveDot(e.target.value)}
                />
                Red Unicorn
              </label>
              <label>
                <input
                  type="radio"
                  name="customActiveDot"
                  value="none"
                  checked={customActiveDot === 'none'}
                  onChange={(e) => setCustomActiveDot(e.target.value)}
                />
                None
              </label>
            </div>
          </BooleanValue>
        </Field>
        <Field>
          <div>
            <label htmlFor="dotsAnimation">dotsAnimation</label>
            <TextInput
              id="dotsAnimation"
              type="text"
              placeholder="default/sliding"
              onChange={(e) => setDotsAnimationText(e.target.value)}
            />
            <button type="submit">Add animation</button>
          </div>
        </Field>
      </Fieldset>
    </Form>
  )
}

export default DotsForm
