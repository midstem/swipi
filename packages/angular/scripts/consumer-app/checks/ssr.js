import assert from 'node:assert/strict'
import { readBuiltHtml, SLIDES } from './environment.js'

const html = readBuiltHtml('index.html')

assert.ok(
  html.includes('ng-server-context'),
  'the build did not prerender the app'
)

SLIDES.forEach((slide) =>
  assert.ok(html.includes(slide), `the server output is missing "${slide}"`)
)

assert.ok(
  html.includes('<p id="state">0/0/0</p>'),
  'the server output does not report an unmeasured carousel'
)

assert.ok(
  !/--swipi-slide-width|translate3d/.test(html),
  'the server output carries a measurement the server could not have taken'
)

console.log('ssr: the prerender is silent and leaves the track untouched')
