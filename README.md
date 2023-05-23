# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/swipi.svg
[npm-url]: http://npmjs.org/package/swipi
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/swipi
[bundlephobia-url]: https://bundlephobia.com/result?p=swipi

<a href='https://midstem.net'>
  <img src='assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a lightweight and compact slider optimized for mobile use. It's built with TypeScript and has a fast loading speed. It's also swipeable, making it easy for users to switch slides with a swipe on their mobile device. Its mobile-friendly design and convenience make it a great choice for improving user experience.</p>

### Installation

**npm**

```bash
$ npm install swipi
```

**yarn**

```bash
$ yarn add swipi
```

## To see and play with examples follow the <a href='https://midstem.github.io/swipi-landing/'>link</a>

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
    <td>showArrows</td>
    <td>Enable/disable arrows</td>
    <td><code>true</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>showDots</td>
    <td>Enable/disable dots</td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>sizeForDefaultDot</td>
    <td>Sets the size for default dot</td>
    <td><code>12</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>sizeForDefaultActiveDot</td>
    <td>Sets the size for default active dot</td>
    <td><code>12</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>dotColor</td>
    <td>
      If a custom dot is not provided but <code>showDots</code> is set to
      <code>true</code> then you can change the default dots color
    </td>
    <td><code>'#c7c7c7'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>activeDotColor</td>
    <td>
      If a custom active dot is not provided but <code>showDots</code> is set
      to <code>true</code> then you can change the active dot color
    </td>
    <td><code>'#000000'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>customDot</td>
    <td>Provide your custom JSX.Element</td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>customActiveDot</td>
    <td>
      Provide your custom active dot. It will be
      used to show the user what slide he is at
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
    <td>Number of visible slides (takes effect only if a user didn't set <code>slidesNumber</code> in the <code>config</code> or if the screen width is wider than what is stated in <code>maxWidth</code> in the <code>config</code>)</td>
    <td>3</td>
    <td>number</td>
  </tr>
  <tr>
    <td>spaceBetweenSlides</td>
    <td>Space between slides (takes effect only if a user didn't set <code>spaceBetween</code> in the <code>config</code> or if the screen width is wider than what is stated in <code>maxWidth</code> in the <code>config</code>)</td>
    <td>0</td>
    <td>number</td>
  </tr>
  <tr>
    <td>animationSpeed</td>
    <td>Sets the duration (in milliseconds) for slide transitions</td>
    <td>300</td>
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
    <td>loop</td>
    <td>Make the slider infinite</td>
    <td>false</td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>config</td>
    <td>
      Takes an array of objects to manipulate slides:
      <code>slidesNumber, maxWidth, biasRight, spaceBetween</code>.
      If <code>config</code> is not provided then the default
      settings of its parameters are used
    </td>
    <td>
      -
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
    <td>Number of visible slides according to <code>maxWidth</code> prop</td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td>maxWidth</td>
    <td>Defines a width after which the number of slides will change</td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td>biasRight</td>
    <td>Show/hide a piece of an element that goes after visible slides</td>
    <td>-</td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>spaceBetween</td>
    <td>Space between slides that can be changed according <code>maxWidth</code></td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Dots animations:</h3>
    </td>
  </tr>
  <tr>
    <td>dotsAnimation</td>
    <td>Active dot behavior</td>
    <td><code>'default'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Options for dots animations:</h3>
    </td>
  </tr>
  <tr>
    <td><code>'default'</code></td>
    <td colspan="3">The active dot instantly moves with the corresponding slide without any animation</td>
  </tr>
  <tr>
    <td><code>'sliding'</code></td>
    <td colspan="3">The active dot smoothly slides to its new position, and the 'passive' dot smoothly fades away from the area it once occupied</td>
  </tr>
  <tr>
   <tr>
    <td colspan="4" align='center'>
      <h3>Slides animations:</h3>
    </td>
  </tr>
  <tr>
    <td>slidesAnimation</td>
    <td>The animation while transitioning between slides</td>
    <td><code>'default'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Options for slides animations:</h3>
    </td>
  </tr>
  <tr>
    <td><code>'default'</code></td>
    <td colspan="3">The slides change each other by sliding from left to right and vice verse, operating in a standard manner so to say</td>
  </tr>
  <tr>
    <td><code>'fade-in'</code></td>
    <td colspan="3">The fade-in animation gradually brings an element into view, transitioning it from complete transparency to full opacity on the screen</td>
  </tr>
  <tr>
</table>

## **Styling**

```css
.swipi - styles the container that wraps the slider

.dots-wrapper - styles the container that wraps the dots

.left-button - styles the left button that gets the user to the previous slide

.right-button - styles the right button that gets the user to the next slide
```
