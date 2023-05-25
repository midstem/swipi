import Slider from './Swipi'
import styled from 'styled-components'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { ConfigType } from './Swipi/types'

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

const configSettings: ConfigType[] = [
  { maxWidth: 2200, slidesNumber: 3 },
  { maxWidth: 1400, slidesNumber: 1, spaceBetween: 4, biasRight: true },
  { maxWidth: 900, slidesNumber: 1 }
]

root.render(
  <Slider
    showDots
    // loop
    //   prevButton={<LeftArrow />}
    //   nextButton={<RightArrow />}
    // config={configSettings}
    biasRight={false}
    customDot={<Dot />}
    customActiveDot={<ActiveDot />}
    config={configSettings}
  >
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'purple' }}></div>
  </Slider>
)
