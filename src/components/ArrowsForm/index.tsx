import { Form, FormName, BooleanProperty, RadioLabel } from '../../styles'
import { ArrowsFormProps } from './types'

const ArrowsForm = ({
  prevButton,
  nextButton,
  setPrevButton,
  setNextButton
}: ArrowsFormProps) => (
  <Form>
    <FormName>Arrows</FormName>
    <BooleanProperty>
      <p>prevButton</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="prevButton"
            value="left-arrow"
            checked={prevButton === 'left-arrow'}
            onChange={(e) => setPrevButton(e.target.value)}
          />
          Arrow left
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="prevButton"
            value="none"
            checked={prevButton === 'none'}
            onChange={(e) => setPrevButton(e.target.value)}
          />
          None
        </RadioLabel>
      </div>
    </BooleanProperty>
    <BooleanProperty>
      <p>nextButton</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="nextButton"
            value="right-arrow"
            checked={nextButton === 'right-arrow'}
            onChange={(e) => setNextButton(e.target.value)}
          />
          Arrow right
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="nextButton"
            value="none"
            checked={nextButton === 'none'}
            onChange={(e) => setNextButton(e.target.value)}
          />
          None
        </RadioLabel>
      </div>
    </BooleanProperty>
  </Form>
)

export default ArrowsForm
