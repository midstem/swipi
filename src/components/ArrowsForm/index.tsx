import { Form, Legend, Fieldset, BooleanValue, Field } from './styles'
import { ArrowsFormProps } from './types'

const ArrowsForm = ({
  prevButton,
  nextButton,
  setPrevButton,
  setNextButton
}: ArrowsFormProps) => (
  <Form>
    <Fieldset>
      <Legend>Arrows</Legend>
      <Field>
        <BooleanValue>
          <p>prevButton</p>
          <div>
            <label>
              <input
                type="radio"
                name="prevButton"
                value="left-arrow"
                checked={prevButton === 'left-arrow'}
                onChange={(e) => setPrevButton(e.target.value)}
              />
              Arrow left
            </label>
            <label>
              <input
                type="radio"
                name="prevButton"
                value="none"
                checked={prevButton === 'none'}
                onChange={(e) => setPrevButton(e.target.value)}
              />
              None
            </label>
          </div>
        </BooleanValue>
        <BooleanValue>
          <p>nextButton</p>
          <div>
            <label>
              <input
                type="radio"
                name="nextButton"
                value="right-arrow"
                checked={nextButton === 'right-arrow'}
                onChange={(e) => setNextButton(e.target.value)}
              />
              Arrow right
            </label>
            <label>
              <input
                type="radio"
                name="nextButton"
                value="none"
                checked={nextButton === 'none'}
                onChange={(e) => setNextButton(e.target.value)}
              />
              None
            </label>
          </div>
        </BooleanValue>
      </Field>
    </Fieldset>
  </Form>
)

export default ArrowsForm
