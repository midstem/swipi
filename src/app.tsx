import { useState } from 'react'
import Slider from './Slider'
import DotsForm from './components/DotsForm'
import SlidesForm from './components/SlidesForm'
import ArrowsForm from './components/ArrowsForm'
import { dives } from './constants'
import { DotsAnimation } from './Slider/types'
import { SlidesAnimation, ValueOf } from './types'
import { Dot, ActiveDot, FormsWrapper } from './styles'
import './styles/normalize.css'
import { ReactComponent as Unicorn } from './assets/unicorn.svg'
import { ReactComponent as ArrowLeft } from './assets/chevron-left.svg'
import { ReactComponent as ArrowRight } from './assets/chevron-right.svg'

const App = () => {
  const [showDots, setShowDots] = useState<boolean>(false)
  const [sizeForDefaultDot, setSizeForDefaultDot] = useState<number>(0)
  const [sizeForDefaultActiveDot, setSizeForDefaultActiveDot] =
    useState<number>(0)
  const [dotColor, setDotColor] = useState<string>('#c7c7c7')
  const [activeDotColor, setActiveDotColor] = useState<string>('')
  const [dotsAnimation, setDotsAnimation] = useState<string>('')
  const [customDot, setCustomDot] = useState<string>('none')
  const [customActiveDot, setCustomActiveDot] = useState<string>('none')
  const [slidesNumber, setSlidesNumber] = useState<number>(0)
  const [spaceBetweenSlides, setSpaceBetweenSlides] = useState<number>(0)
  const [animationSpeed, setAnimationSpeed] = useState<number>(0)
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(0)
  const [slidesAnimation, setSlidesAnimation] = useState<string>('none')
  const [prevButton, setPrevButton] = useState<string>('none')
  const [nextButton, setNextButton] = useState<string>('none')
  const [maxWidth, setMaxWidth] = useState<number>(0)
  const [configSlidesNumber, setConfigSlidesNumber] = useState<number>(0)
  const [spaceBetween, setSpaceBetween] = useState<number>(0)
  const [biasRight, setBiasRight] = useState<boolean>(false)

  return (
    <>
      <Slider
        showDots={showDots}
        sizeForDefaultDot={
          sizeForDefaultDot === 0 ? undefined : sizeForDefaultDot
        }
        sizeForDefaultActiveDot={
          sizeForDefaultActiveDot === 0 ? undefined : sizeForDefaultActiveDot
        }
        dotColor={dotColor === '#c7c7c7' ? undefined : dotColor}
        activeDotColor={activeDotColor === '' ? undefined : activeDotColor}
        dotsAnimation={
          dotsAnimation === '' ? undefined : (dotsAnimation as DotsAnimation)
        }
        customDot={
          customDot === 'none' ? undefined : customDot === 'circle' ? (
            <Dot data-cy="default-custom-dot" />
          ) : (
            <Unicorn data-cy="black-unicorn" />
          )
        }
        customActiveDot={
          customActiveDot === 'none' ? undefined : customActiveDot ===
            'red-unicorn' ? (
            <Unicorn data-cy="red-unicorn" style={{ fill: 'red' }} />
          ) : (
            <ActiveDot data-cy="custom-active-dot" />
          )
        }
        slidesNumber={slidesNumber === 0 ? undefined : slidesNumber}
        spaceBetweenSlides={
          spaceBetweenSlides === 0 ? undefined : spaceBetweenSlides
        }
        animationSpeed={animationSpeed === 0 ? undefined : animationSpeed}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed === 0 ? undefined : autoplaySpeed}
        slidesAnimation={
          slidesAnimation === ''
            ? undefined
            : (slidesAnimation as ValueOf<SlidesAnimation>)
        }
        config={[
          {
            maxWidth,
            slidesNumber: configSlidesNumber,
            spaceBetween,
            biasRight
          }
        ]}
        prevButton={
          prevButton === 'none' ? undefined : <ArrowLeft data-cy="left-arrow" />
        }
        nextButton={
          nextButton === 'none' ? undefined : (
            <ArrowRight data-cy="right-arrow" />
          )
        }
      >
        {dives.map((div) => (
          <>{div.element}</>
        ))}
      </Slider>
      <FormsWrapper>
        <div>
          <DotsForm
            showDots={showDots}
            sizeForDefaultDot={sizeForDefaultDot}
            dotColor={dotColor}
            customDot={customDot}
            customActiveDot={customActiveDot}
            setShowDots={setShowDots}
            setSizeForDefaultDot={setSizeForDefaultDot}
            setSizeForDefaultActiveDot={setSizeForDefaultActiveDot}
            setDotColor={setDotColor}
            setActiveDotColor={setActiveDotColor}
            setDotsAnimation={setDotsAnimation}
            setCustomDot={setCustomDot}
            setCustomActiveDot={setCustomActiveDot}
          />
          <ArrowsForm
            prevButton={prevButton}
            nextButton={nextButton}
            setPrevButton={setPrevButton}
            setNextButton={setNextButton}
          />
        </div>
        <SlidesForm
          autoplay={autoplay}
          biasRight={biasRight}
          setSlidesNumber={setSlidesNumber}
          setSpaceBetweenSlides={setSpaceBetweenSlides}
          setAnimationSpeed={setAnimationSpeed}
          setAutoplay={setAutoplay}
          setAutoplaySpeed={setAutoplaySpeed}
          setSlidesAnimation={setSlidesAnimation}
          setMaxWidth={setMaxWidth}
          setConfigSlidesNumber={setConfigSlidesNumber}
          setSpaceBetween={setSpaceBetween}
          setBiasRight={setBiasRight}
        />
      </FormsWrapper>
    </>
  )
}

export default App
