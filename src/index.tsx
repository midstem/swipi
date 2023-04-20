import Slider from './Slider'
import styled from 'styled-components'
import ReactDOM from 'react-dom/client'

export const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`

export const ActiveDot = styled.div`
  height: 13px;
  width: 13px;
  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
`

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const configSettings = [
  { maxWidth: 2200, slidesNumber: 3 },
  { maxWidth: 1400, slidesNumber: 2, spaceBetween: 4 },
  { maxWidth: 900, slidesNumber: 1 }
]

root.render(
  <Slider
    showDots
    //   prevButton={<LeftArrow />}
    //   nextButton={<RightArrow />}
    config={configSettings}
    customDot={<Dot />}
    customActiveDot={<ActiveDot />}
    loop={false}
  >
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'green' }}></div>
    <div style={{ height: '300px', backgroundColor: 'orange' }}></div>
    <div style={{ height: '300px', backgroundColor: 'purple' }}></div>
  </Slider>
)
