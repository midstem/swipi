import { Form, FormName, BooleanProperty, RadioLabel } from '../../styles'
import { ArrowsFormProps } from './types'

const ArrowsForm = ({
  prevButton,
  nextButton,
  showArrows,
  setShowArrows,
  setPrevButton,
  setNextButton
}: ArrowsFormProps) => (
  <Form>
    <FormName>Arrows</FormName>
    <BooleanProperty>
      <p>showArrows</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="showArrows"
            value="Yes"
            checked={showArrows}
            onChange={() => setShowArrows(true)}
          />
          Yes
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="No"
            name="showArrows"
            checked={!showArrows}
            onChange={() => setShowArrows(false)}
          />
          No
        </RadioLabel>
      </div>
    </BooleanProperty>
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
