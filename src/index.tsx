import Slider from './Slider';
import styled from 'styled-components';
import ReactDOM from 'react-dom/client';
import React from 'react';

export const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`;

export const ActiveDot = styled.div`
  height: 13px;
  width: 13px;
  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Slider>
    <div style={{ height: '300px', backgroundColor: 'red' }}></div>
    <div style={{ height: '300px', backgroundColor: 'black' }}></div>
    <div style={{ height: '300px', backgroundColor: 'green' }}></div>
    <div style={{ height: '300px', backgroundColor: 'orange' }}></div>
    <div style={{ height: '300px', backgroundColor: 'purple' }}></div>
  </Slider>
);
