// import Slider from './Slider';
// import { ConfigType } from './Slider/types';

// export { ConfigType };
// export default Slider;

import React from 'react';
import Slider from './Slider';
import styled from 'styled-components';
import ReactDOM from 'react-dom/client';

export const Dot = styled.div`
  height: 25px;
  width: 25px;

  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
  /* margin-left: 30px; */
`;

export const ActiveDot = styled.div`
  height: 15px;
  width: 15px;

  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Slider
    showDots
    activeDotColor="red"
    dotsAnimation="sliding"
    // sizeForDefaultDot={20}
    // sizeForDefaultActiveDot={8}
    customDot={<Dot />}
    customActiveDot={<ActiveDot />}
  >
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'green' }}></div>
    <div style={{ height: '300px', backgroundColor: 'orange' }}></div>
    <div style={{ height: '300px', backgroundColor: 'purple' }}></div>
  </Slider>
);
