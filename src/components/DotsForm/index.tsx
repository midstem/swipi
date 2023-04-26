import { DotsFormProps } from './types'
import {
  Form,
  FormName,
  BooleanProperty,
  RadioLabel,
  Property,
  NumberInput
} from '../../styles'
import { ColorPane } from './styles'

const DotsForm = ({
  showDots,
  sizeForDefaultDot,
  dotColor,
  customDot,
  customActiveDot,
  setShowDots,
  setSizeForDefaultDot,
  setSizeForDefaultActiveDot,
  setDotColor,
  setActiveDotColor,
  setDotsAnimation,
  setCustomDot,
  setCustomActiveDot
}: DotsFormProps) => (
  <Form>
    <FormName>Dots</FormName>
    <BooleanProperty>
      <p>showDots</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="showDots"
            value="Yes"
            checked={showDots}
            onChange={() => setShowDots(true)}
          />
          Yes
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="No"
            name="showDots"
            checked={!showDots}
            onChange={() => setShowDots(false)}
          />
          No
        </RadioLabel>
      </div>
    </BooleanProperty>
    <Property>
      <label htmlFor="dotsAnimation">dotsAnimation</label>
      <select
        id="dotsAnimation"
        onChange={(e) => setDotsAnimation(e.target.value)}
      >
        <option value="">-- Please select --</option>
        <option value="default">default</option>
        <option value="sliding">sliding</option>
      </select>
    </Property>
    <Property>
      <label htmlFor="sizeForDefaultDot">sizeForDefaultDot</label>
      <NumberInput
        data-cy="default-dot-size-input"
        id="sizeForDefaultDot"
        placeholder="12"
        onChange={(e) => {
          console.log(sizeForDefaultDot)
          setSizeForDefaultDot(+e.target.value)
        }}
      />
    </Property>
    <Property>
      <label htmlFor="sizeForDefaultActiveDot">sizeForDefaultActiveDot</label>
      <NumberInput
        data-cy="default-active-dot-size-input"
        id="sizeForDefaultActiveDot"
        placeholder="12"
        onChange={(e) => setSizeForDefaultActiveDot(+e.target.value)}
      />
    </Property>
    <Property>
      <label htmlFor="dotColor">dotColor</label>
      <ColorPane
        data-cy="dot-color-input"
        id="dotColor"
        type="color"
        value={dotColor}
        onChange={(e) => setDotColor(e.target.value)}
      />
    </Property>
    <Property>
      <label htmlFor="activeDotColor">activeDotColor</label>
      <ColorPane
        data-cy="active-dot-color-input"
        id="activeDotColor"
        type="color"
        onChange={(e) => setActiveDotColor(e.target.value)}
      />
    </Property>
    <BooleanProperty>
      <p>customDot</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="customDot"
            value="circle"
            checked={customDot === 'circle'}
            onChange={(e) => setCustomDot(e.target.value)}
          />
          Custom circle
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="customDot"
            value="unicorn"
            checked={customDot === 'unicorn'}
            onChange={(e) => setCustomDot(e.target.value)}
          />
          Unicorn
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="customDot"
            value="none"
            checked={customDot === 'none'}
            onChange={(e) => setCustomDot(e.target.value)}
          />
          None
        </RadioLabel>
      </div>
    </BooleanProperty>
    <BooleanProperty>
      <p>customActiveDot</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="customActiveDot"
            value="active-circle"
            checked={customActiveDot === 'active-circle'}
            onChange={(e) => setCustomActiveDot(e.target.value)}
          />
          Custom active circle
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="customActiveDot"
            value="red-unicorn"
            checked={customActiveDot === 'red-unicorn'}
            onChange={(e) => setCustomActiveDot(e.target.value)}
          />
          Red Unicorn
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="customActiveDot"
            value="none"
            checked={customActiveDot === 'none'}
            onChange={(e) => setCustomActiveDot(e.target.value)}
          />
          None
        </RadioLabel>
      </div>
    </BooleanProperty>
  </Form>
)

export default DotsForm
