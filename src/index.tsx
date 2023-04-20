import ReactDOM from 'react-dom/client';
import { Wrapper } from './styles';
import { ReactComponent as ArrowLeft } from './assets/chevron-left.svg';
import { ReactComponent as ArrowRight } from './assets/chevron-right.svg';
import { ReactComponent as Circle } from './assets/circle-small.svg';
import { ReactComponent as Rabbit } from './assets/rabbit.svg';
import { ReactComponent as Unicorn } from './assets/unicorn.svg';
import GlobalStyle from './styles/GlobalStyle';
import './styles/normalize.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

import styled from 'styled-components';
import Slider from './Slider';
import { divs } from './constants';

const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`;

const ActiveDot = styled.div`
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





const App = () => (
  <>
    <Slider>
      {divs.map((div) => (
        <>{div.element}</>
      ))}
    </Slider>
      <form method="post">
        <fieldset>
          <legend>Show dots?</legend>
          <label><input type="radio" name="radio" value="yes" /> Yes</label>
          <label><input type="radio" name="radio" value="no" /> No</label>
        </fieldset>
      </form>

  </>
);





root.render(
  <>
    <GlobalStyle />
    <Wrapper>
      <App />
    </Wrapper>
  </>
);
