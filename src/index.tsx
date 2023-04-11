import ReactDOM from 'react-dom/client';
import React from 'react';
import { Wrapper } from './styles';
import GlobalStyle from './GlobalStyle';
import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <GlobalStyle />
    <Wrapper>
      <App />
    </Wrapper>
  </>
);
