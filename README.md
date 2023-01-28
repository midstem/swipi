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
    <td>colorForDefaultDot</td>
    <td>
      If a custom dot is not provided but <code>showDots</code> is set to
      <code>true</code> then you can change the default dots color.
    </td>
    <td><code>'orange'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>colorForDefaultActiveDot</td>
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
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>nextButton</td>
    <td>Custom element to move slides forward</td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>sliderUpdates</td>
    <td>
      Takes an array of objects to manipulate slides:
      <code>countSlide, maxWidth, isSlideCornerRight, spaceBetween</code>.
      If <code>sliderUpdates</code> is not provided then the default
      settings of it's properties are used.
    </td>
    <td>
      <code>
        [{ countSlide: 2, maxWidth: 992 },{ countSlide: 1,
        maxWidth: 450, isSlideCornerRight: true, spaceBetween: 3 }]
      </code>
    </td>
    <td>array</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3><code>sliderUpdates</code> parameters:</h3>
    </td>
  </tr>
  <tr>
    <td>countSlide</td>
    <td>Amount of visible slides.</td>
    <td>
      <code>3</code> / 
      screen width <= 992px <code>2</code> / 
      screen width <= 450px <code>1</code>
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
    <td>isSlideCornerRight</td>
    <td>Show/hide a pice of an element that goes after visible slides.</td>
    <td><code>false</code> / screen width <= 450px <code>true</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>spaceBetween</td>
    <td>Space between slides.</td>
    <td><code>3</code></td>
    <td>number</td>
  </tr>
</table>

<br/>

## Development

Want to run demos locally

```bash
git clone https://github.com/MaKs-Tkachyk/image_carousel.git
cd image_carousel
```

**npm**
```bash
npm install
npm run dev
```

**yarn**
```bash
yarn
yarn dev
```
**Open** http://localhost:5173/