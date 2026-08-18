import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { compile } from 'svelte/compiler'

export const SLIDES = ['one', 'two', 'three', 'four']

const SOURCE = resolve('src', 'Carousel.svelte')

const OUTPUT = resolve('node_modules', '.swipi-checks')

export const loadCarousel = async (generate) => {
  const { js } = compile(readFileSync(SOURCE, 'utf8'), {
    filename: 'Carousel.svelte',
    generate
  })

  mkdirSync(OUTPUT, { recursive: true })
  writeFileSync(join(OUTPUT, 'package.json'), '{ "type": "module" }\n')

  const module = join(OUTPUT, `Carousel.${generate}.js`)

  writeFileSync(module, js.code)

  return (await import(pathToFileURL(module).href)).default
}
