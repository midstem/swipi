import Slider from './Slider';
import styled from 'styled-components';
import React from 'react';
import { divs } from './constants';
import { ReactComponent as ArrowLeft } from './assets/chevron-left.svg';
import { ReactComponent as ArrowRight } from './assets/chevron-right.svg';
import { ReactComponent as Circle } from './assets/circle-small.svg';
import { ReactComponent as Rabbit } from './assets/rabbit.svg';
import { ReactComponent as Unicorn } from './assets/unicorn.svg';

const Dot = styled.div`
  /* Тут ти можеш змінювати height/width і дивитись чи 
  крапочка залишається по центру. Не обов'язково змінювати два одразу */
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`;

const ActiveDot = styled.div`
  /* Тут ти можеш змінювати height/width і дивитись чи 
  крапочка залишається по центру. Не обов'язково змінювати два одразу */
  height: 13px;
  width: 13px;
  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
`;

const mediaSettings = [
  { maxWidth: 2200, slidesNumber: 3, spaceBetween: 5 },
  { maxWidth: 1400, slidesNumber: 2, spaceBetween: 4 },
  { maxWidth: 900, slidesNumber: 1, spaceBetween: 2 },
];

// Фігурки:
// <ArrowLeft />
// <ArrowRight />
// <Circle />
// <Rabbit />
// <Unicorn />

// Приклад щоб ти могла бачити як його прописувати
// <Slider showDots customDot={<Dot />} config={mediaSettings} slidesNumber={3} dotColor='#c7c7c7'>

const App = () => (
  <>
    <Slider>
      {divs.map((div) => (
        <>{div.element}</>
      ))}
    </Slider>
  </>
);

export default App;
