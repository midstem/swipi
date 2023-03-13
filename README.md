# Infinite Image Slider

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/infinite-image-slider.svg
[npm-url]: http://npmjs.org/package/infinite-image-slider
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/infinite-image-slider
[bundlephobia-url]: https://bundlephobia.com/result?p=infinite-image-slider

<a href='https://domdev.pro/'>
  <img src='assets/domdev.png' height='60'>
</a>

<p><b>The Infinity Image Slider</b> is a lightweight and compact slider optimized for mobile use. It's built with TypeScript and has a fast loading speed. It's also swappable, making it easy for users to switch slides with a swipe on their mobile device. Its mobile-friendly design and convenience make it a great choice for improving user experience.</p>

### Installation
**npm**

```bash
npm install infinite-image-slider
```

**yarn**

```bash
yarn add infinite-image-slider
```

## [Default](https://codesandbox.io/s/default-demo-g81knf)
```js
import Slider from "infinite-image-slider";
import pictures from "./constants";
import { SliderWrapper, Image } from "./styles";

const App = () => (
  <SliderWrapper>
    <Slider>
      {pictures.map((picture) => (
        <Image key={picture.id} src={picture.src} alt={picture.alt} />
      ))}
    </Slider>
  </SliderWrapper>
);
```

## [With arrows](https://codesandbox.io/s/demo-with-arrows-uqf4rf)
```js
import Slider from "infinite-image-slider";
import pictures from "./constants";
import { SliderWrapper, Image } from "./styles";
import { ReactComponent as ArrowLeft } from "./assets/arrow-left.svg";
import { ReactComponent as ArrowRight } from "./assets/arrow-right.svg";

const App = () => (
  <SliderWrapper>
    <Slider 
      nextButton={<ArrowRight />}
      prevButton={<ArrowLeft />}
    >
      {pictures.map((picture) => (
        <Image key={picture.id} src={picture.src} alt={picture.alt} />
      ))}
    </Slider>
  </SliderWrapper>
);
```

## [With arrows and dots](https://codesandbox.io/s/demo-with-arrows-dots-unqoph)
```js
import Slider from "infinite-image-slider";
import pictures from "./constants";
import { SliderWrapper, Image } from "./styles";
import { Circle, Diamond } from "./customDots";
import { ReactComponent as ArrowLeft } from "./assets/arrow-left.svg";
import { ReactComponent as ArrowRight } from "./assets/arrow-right.svg";

const App = () => (
  <SliderWrapper>
    <Slider
      showDots
      customDot={<Circle />}
      customActiveDot={<Diamond />}
      nextButton={<ArrowRight />}
      prevButton={<ArrowLeft />}
    >
      {pictures.map((picture) => (
        <Image key={picture.id} src={picture.src} alt={picture.alt} />
      ))}
    </Slider>
  </SliderWrapper>
);
```

## [All custom settings](https://codesandbox.io/s/all-custom-demo-vfxhtr)
```js
import Slider from "infinite-image-slider"
import pictures from "./constants"
import { SliderWrapper, Image } from "./styles"
import { Circle, Diamond } from "./customDots"
import { ReactComponent as ArrowLeft } from "./assets/arrow-left.svg"
import { ReactComponent as ArrowRight } from "./assets/arrow-right.svg"
import "./styles.css"

const configSettings = [
  { maxWidth: 2200, slidesNumber: 3, spaceBetween: 5 },
  { maxWidth: 1400, slidesNumber: 2, spaceBetween: 4 },
  { maxWidth: 900, slidesNumber: 1, spaceBetween: 2 }
]

const App = () => (
  <SliderWrapper>
    <Slider
      showDots
      prevButton={<ArrowLeft />}
      nextButton={<ArrowRight />}
      config={configSettings}
      customDot={<Circle />}
      customActiveDot={<Diamond />}
      autoplay
      autoplaySpeed={5300}
    >
      {pictures.map((picture) => (
        <Image key={picture.id} src={picture.src} alt={picture.alt} />
      ))}
    </Slider>
  </SliderWrapper>
);
```

## **Browsers support**

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 3 versions| last 3 versions| last 3 versions| last 3 versions

## **Props**

<table width='100%'>
  <tr>
    <th><h3><b>Props</b></h3></th>
    <th><h3><b>Description</b></h3></th>
    <th><h3><b>Default</b></h3></th>
    <th><h3><b>Type</b></h3></th>
  </tr>
  <tr>
    <td>showDots</td>
    <td>Enable/disable dots.</td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>dotColor</td>
    <td>
      If a custom dot is not provided but <code>showDots</code> is set to
      <code>true</code> then you can change the default dots color.
    </td>
    <td><code>'orange'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>activeDotColor</td>
    <td>
      If a custom active dot is not provided but <code>showDots</code> is set
      to <code>true</code> then you can change the active dot color.
    </td>
    <td><code>'black'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>customDot</td>
    <td>Provide your custom JSX.Element.</td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>customActiveDot</td>
    <td>
      Provide your your custom active dot. It will be
      used to show to the user what slide he is at.
    </td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>prevButton</td>
    <td>Custom element to move slides back</td>
    <td>ᐸ</td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>nextButton</td>
    <td>Custom element to move slides forward</td>
    <td>ᐳ</td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>slidesNumber</td>
    <td>Number of visible slides.</td>
    <td>3</td>
    <td>number</td>
  </tr>
  <tr>
    <td>spaceBetweenSlides</td>
    <td>Space between slides.</td>
    <td>0</td>
    <td>number</td>
  </tr>
  <tr>
    <td>autoplay</td>
    <td>A boolean that enables slides to slide automatically</td>
    <td>false</td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>autoplaySpeed</td>
    <td>The interval in milliseconds with which the slides are changed</td>
    <td>4000</td>
    <td>number</td>
  </tr>
  <tr>
    <td>config</td>
    <td>
      Takes an array of objects to manipulate slides:
      <code>slidesNumber, maxWidth, biasRight, spaceBetween</code>.
      If <code>config</code> is not provided then the default
      settings of it's parameters are used.
    </td>
    <td>
      <div>
        <code>[{ slidesNumber: 2, maxWidth: 992 }, { slidesNumber: 1, maxWidth: 450, biasRight: true, spaceBetween: 3 }]</code>
      </div>
    </td>
    <td>array</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3><code>config</code> parameters:</h3>
    </td>
  </tr>
  <tr>
    <td>slidesNumber</td>
    <td>Number of visible slides.</td>
    <td>
      <div>screen width > 992px: <code>3</code> slides</div>
      <div>screen width <= 992px: <code>2</code> slides</div>
      <div>screen width <= 450px: <code>1</code> slide</div>
    </td>
    <td>number</td>
  </tr>
  <tr>
    <td>maxWidth</td>
    <td>Defines a width after which the slides amount will change.</td>
    <td><code>992</code>px and <code>450</code>px</td>
    <td>number</td>
  </tr>
  <tr>
    <td>biasRight</td>
    <td>Show/hide a pice of an element that goes after visible slides.</td>
    <td>
      <div>screen width > 450: <code>false</code></div>
      <div>screen width <= 450px: <code>true</code></div>
    </td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>spaceBetween</td>
    <td>Space between slides.</td>
    <td><code>0</code>px</td>
    <td>number</td>
  </tr>
</table>

## **Styling**

```css
.dots-wrapper
```

<br/>

## **Welcome to suggestions**

```
https - $ git clone https://github.com/MaKs-Tkachyk/image_carousel.git
or
ssh - $ git clone git@github.com:MaKs-Tkachyk/image_carousel.git

$ cd infinite-image-slider

$ git checkout demo

$ npm install
or
$ yarn

$ npm start
or
$ yarn start

Open: http://localhost:5173/
```