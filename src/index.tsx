// import { ConfigType } from './Slider/types';

// export { ConfigType };
// export default Slider;

import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from './Slider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div style={{ maxWidth: '800px' }}>
    <Slider showDots>
      <div style={{ height: '300px', backgroundColor: 'black' }} />
      <div style={{ height: '300px', backgroundColor: 'red' }} />
      <div style={{ height: '300px', backgroundColor: 'purple' }} />
      <div style={{ height: '300px', backgroundColor: 'green' }} />
    </Slider>
  </div>
);
