import { SlidesFormProps } from './types'
import {
  Form,
  Legend,
  Fieldset,
  BooleanValue,
  Field,
  TextInput
} from './styles'

const SlidesForm = ({
  autoplay,
  setSlidesNumber,
  setSpaceBetweenSlides,
  setAnimationSpeed,
  setAutoplay,
  setAutoplaySpeed,
  setSlidesAnimation
}: SlidesFormProps): JSX.Element => (
  <Form>
    <Fieldset>
      <Legend>Slides</Legend>
      <Field>
        <div>
          <label htmlFor="slidesNumber">slidesNumber</label>
          <TextInput
            id="slidesNumber"
            type="number"
            placeholder="3"
            onChange={(e) => {
              setSlidesNumber(+e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="spaceBetweenSlides">spaceBetweenSlides</label>
          <TextInput
            id="spaceBetweenSlides"
            type="number"
            placeholder="0"
            onChange={(e) => setSpaceBetweenSlides(+e.target.value)}
          />
        </div>
      </Field>
      <Field>
        <div>
          <label htmlFor="animationSpeed">animationSpeed</label>
          <TextInput
            id="animationSpeed"
            type="number"
            placeholder="300"
            onChange={(e) => setAnimationSpeed(+e.target.value)}
          />
        </div>
      </Field>
      <Field>
        <BooleanValue>
          <p>autoplay</p>
          <div>
            <label>
              <input
                type="radio"
                name="autoplay"
                checked={autoplay}
                onChange={() => setAutoplay(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="autoplay"
                checked={!autoplay}
                onChange={() => setAutoplay(false)}
              />
              No
            </label>
          </div>
        </BooleanValue>
        <Field>
          <div>
            <label htmlFor="autoplaySpeed">autoplaySpeed</label>
            <TextInput
              id="autoplaySpeed"
              type="number"
              placeholder="4000"
              onChange={(e) => setAutoplaySpeed(+e.target.value)}
            />
          </div>
        </Field>
      </Field>
      <Field>
        <div>
          <label htmlFor="dotsAnimation">slidesAnimation</label>
          <select onChange={(e) => setSlidesAnimation(e.target.value)}>
            <option value="">-- Please select --</option>
            <option value="default">default</option>
            <option value="fade-in">fade-in</option>
          </select>
        </div>
      </Field>
    </Fieldset>
  </Form>
)

export default SlidesForm
