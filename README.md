# Image_carousel

## [DomDev](https://domdev.pro/)

<br>

### Installation
**npm**

```bash
npm install infinite-image-slider
```

**yarn**

```bash
yarn add infinite-image-slider
```

## 👉 [Example](https://codesandbox.io/s/infinite-image-slider-8y1ts3) 👈
```js
import React from 'react'
import Slider from 'infinite-image-slider'

const SimpleSlider = () => (
  <Slider showDots={true}>
    <div style={{height: '300px', backgroundColor: 'black'}}>
      <h3>1</h3>
    </div>
    <div style={{height: '300px', backgroundColor: 'blue'}}>
      <h3>2</h3>
    </div>
    <div style={{height: '300px', backgroundColor: 'red'}}>
      <h3>3</h3>
    </div>
    <div style={{height: '300px', backgroundColor: 'green'}}>
      <h3>4</h3>
    </div>
    <div style={{height: '300px', backgroundColor: 'pink'}}>
      <h3>5</h3>
    </div>
  </Slider>
)
```

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
    <td>Amount of visible slides.</td>
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