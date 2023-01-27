# Image_carousel

### Installation
**npm**

```bash
npm install image_carousel
```

**yarn**

```bash
yarn add image_carousel
```

## **Example**
```js
import React from 'react';
import Slider from 'react-carousel';

const SimpleSlider = () => (
  <Slider>
    <div>
      <h3>1</h3>
    </div>
    <div>
      <h3>2</h3>
    </div>
    <div>
      <h3>3</h3>
    </div>
    <div>
      <h3>4</h3>
    </div>
    <div>
      <h3>5</h3>
    </div>
  </Slider>
);
```

## **Props**

| Prop | Description | Default | Type |
|------|-------------|---------|------|
| showDots | Enable/disable dots | false | boolean |
| colorForDefaultDot | If custom dot is not provided but ```showDots``` is set to ```true``` then you can change there color | ```orange``` | string |
| activeColorForDefaultDot | Is custom active dot is not provided but ```showDots``` is set to ```true``` then you can change the dot color | ```black``` | string |
| customDot | Provide your own dot | - | JSX.Element |
| customActiveDot | Provide your own active dot (Will be used to notify through dots what slide the user is at) | - | JSX.Element |
| sliderUpdates | Changes the amount of visible slides. Can also add gap between the slides. Takes ```countSlide, maxWidth, isSlideCornerRight, spaceBetween``` | ```[{ countSlide: 2, maxWidth: 992 }, { countSlide: 1, maxWidth: 450, isSlideCornerRight: true, spaceBetween: 3 }]``` | array of objects |
| sliderUpdates parameters: | | | |
| countSlide | The amount of visible slides | - | number |
| maxWidth | The amount of slides will change after specified width | - | number |
| isSlideCornerRight | Show/hide a pice of an element that goes after visible slides | false | boolean |
| spaceBetween | Space between slides | 0 | number |

### Development

Want to run demos locally

```bash
git clone https://github.com/MaKs-Tkachyk/image_carousel.git
cd image_carousel
```

***npm***
```bash
npm install
npm run dev
```

***yarn***
```bash
yarn
yarn dev
```
**Open** http://localhost:5173/