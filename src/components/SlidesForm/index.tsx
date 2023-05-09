import { SlidesFormProps } from './types'
import {
  Form,
  FormName,
  BooleanProperty,
  RadioLabel,
  Property,
  NumberInput
} from '../../styles'

const SlidesForm = ({
  autoplay,
  biasRight,
  setSlidesNumber,
  setSpaceBetweenSlides,
  setAnimationSpeed,
  setAutoplay,
  setAutoplaySpeed,
  setSlidesAnimation,
  setMaxWidth,
  setConfigSlidesNumber,
  setSpaceBetween,
  setBiasRight
}: SlidesFormProps): JSX.Element => (
  <Form>
    <FormName>Slides</FormName>
    <Property>
      <label htmlFor="slidesNumber">slidesNumber</label>
      <NumberInput
        data-cy="slides-number-input"
        id="slidesNumber"
        placeholder="3"
        onChange={(e) => {
          setSlidesNumber(+e.target.value)
        }}
      />
    </Property>
    <Property>
      <label htmlFor="spaceBetweenSlides">spaceBetweenSlides</label>
      <NumberInput
        data-cy="space-between-slides-input"
        id="spaceBetweenSlides"
        placeholder="10"
        onChange={(e) => setSpaceBetweenSlides(+e.target.value)}
      />
    </Property>
    <Property>
      <label htmlFor="animationSpeed">animationSpeed</label>
      <NumberInput
        data-cy="animation-speed-input"
        id="animationSpeed"
        placeholder="300"
        onChange={(e) => setAnimationSpeed(+e.target.value)}
      />
    </Property>
    <BooleanProperty>
      <p>autoplay</p>
      <div>
        <RadioLabel>
          <input
            type="radio"
            name="autoplay"
            checked={autoplay}
            onChange={() => setAutoplay(true)}
          />
          Yes
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="autoplay"
            checked={!autoplay}
            onChange={() => setAutoplay(false)}
          />
          No
        </RadioLabel>
      </div>
    </BooleanProperty>
    <Property>
      <label htmlFor="autoplaySpeed">autoplaySpeed</label>
      <NumberInput
        id="autoplaySpeed"
        placeholder="4000"
        onChange={(e) => setAutoplaySpeed(+e.target.value)}
      />
    </Property>
    <Property>
      <label htmlFor="dotsAnimation">slidesAnimation</label>
      <select onChange={(e) => setSlidesAnimation(e.target.value)}>
        <option value="">-- Please select --</option>
        <option value="default">default</option>
        <option value="fade-in">fade-in</option>
      </select>
    </Property>
    <Form as="div" style={{ boxShadow: 'none' }}>
      <FormName>config</FormName>
      <Property>
        <label htmlFor="maxWidth">maxWidth</label>
        <NumberInput
          data-cy="max-number-input"
          id="maxWidth"
          placeholder="1200"
          onChange={(e) => setMaxWidth(+e.target.value)}
        />
      </Property>
      <Property>
        <label htmlFor="slidesNumber">slidesNumber</label>
        <NumberInput
          data-cy="config-slides-number-input"
          id="slidesNumber"
          type="number"
          placeholder="3"
          onChange={(e) => setConfigSlidesNumber(+e.target.value)}
        />
      </Property>
      <Property>
        <label htmlFor="spaceBetween">spaceBetween</label>
        <NumberInput
          data-cy="space-between-input"
          id="spaceBetween"
          type="number"
          placeholder="10"
          onChange={(e) => setSpaceBetween(+e.target.value)}
        />
      </Property>
      <BooleanProperty>
        <p>biasRight</p>
        <div>
          <RadioLabel>
            <input
              type="radio"
              name="biasRight"
              value="yes"
              checked={biasRight}
              onChange={() => setBiasRight(true)}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="biasRight"
              value="no"
              checked={!biasRight}
              onChange={() => setBiasRight(false)}
            />
            No
          </RadioLabel>
        </div>
      </BooleanProperty>
    </Form>
  </Form>
)

export default SlidesForm
