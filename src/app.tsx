import { useState } from 'react'
import Slider from './Slider'
import DotsForm from './components/DotsForm'
import { dives } from './constants'
import { DotsAnimation } from './Slider/types'
import { Dot, ActiveDot } from './styles'
import { ReactComponent as Unicorn } from './assets/unicorn.svg'
import './styles/normalize.css'

const App = () => {
  const [showDots, setShowDots] = useState<boolean>(false)
  const [sizeForDefaultDot, setSizeForDefaultDot] = useState<number>(0)
  const [sizeForDefaultActiveDot, setSizeForDefaultActiveDot] =
    useState<number>(0)
  const [dotColor, setDotColor] = useState<string>('')
  const [activeDotColor, setActiveDotColor] = useState<string>('')
  const [dotsAnimation, setDotsAnimation] = useState<string>('')
  const [dotsAnimationText, setDotsAnimationText] = useState<string>('')
  const [customDot, setCustomDot] = useState<string>('none')
  const [customActiveDot, setCustomActiveDot] = useState<string>('none')

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
        dotColor={dotColor === '' ? undefined : dotColor}
        activeDotColor={activeDotColor === '' ? undefined : activeDotColor}
        dotsAnimation={
          dotsAnimation === '' ? undefined : (dotsAnimation as DotsAnimation)
        }
        customDot={
          customDot === 'none' ? undefined : customDot === 'circle' ? (
            <Dot />
          ) : (
            <Unicorn />
          )
        }
        customActiveDot={
          customActiveDot === 'none' ? undefined : customActiveDot ===
            'red-unicorn' ? (
            <Unicorn style={{ fill: 'red' }} />
          ) : (
            <ActiveDot />
          )
        }
      >
        {dives.map((div) => (
          <>{div.element}</>
        ))}
      </Slider>
      <DotsForm
        showDots={showDots}
        sizeForDefaultDot={sizeForDefaultDot}
        dotsAnimationText={dotsAnimationText}
        customDot={customDot}
        customActiveDot={customActiveDot}
        setShowDots={setShowDots}
        setSizeForDefaultDot={setSizeForDefaultDot}
        setSizeForDefaultActiveDot={setSizeForDefaultActiveDot}
        setDotColor={setDotColor}
        setActiveDotColor={setActiveDotColor}
        setDotsAnimation={setDotsAnimation}
        setDotsAnimationText={setDotsAnimationText}
        setCustomDot={setCustomDot}
        setCustomActiveDot={setCustomActiveDot}
      />
    </>
  )
}

export default App
