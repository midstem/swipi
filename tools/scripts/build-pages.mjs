import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const OUTPUT = resolve(ROOT, 'dist-pages')

const PLAYGROUNDS = [
  { id: 'react', title: 'React', packageName: '@midstem/swipi-react' },
  { id: 'vue', title: 'Vue', packageName: '@midstem/swipi-vue' },
  { id: 'svelte', title: 'Svelte', packageName: '@midstem/swipi-svelte' },
  { id: 'angular', title: 'Angular', packageName: '@midstem/swipi-angular' },
  { id: 'vanilla', title: 'Vanilla JS', packageName: '@midstem/swipi' }
]

const run = (workspace) =>
  execFileSync('npm', ['run', 'build', '--workspace', workspace], {
    cwd: ROOT,
    stdio: 'inherit'
  })

const buildPlayground = ({ id }) => {
  run(`@swipi/playground-${id}`)

  cpSync(
    resolve(ROOT, 'apps', `playground-${id}`, 'dist'),
    resolve(OUTPUT, id),
    {
      recursive: true
    }
  )
}

const toCard = ({ id, title, packageName }) => `
      <a class="card" href="./${id}/">
        <span class="card__title">${title}</span>
        <code class="card__package">${packageName}</code>
      </a>`

const buildIndex = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Swipi playgrounds</title>
    <style>
      body {
        margin: 0;
        padding: 48px 20px;
        background: #000;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      main {
        max-width: 720px;
        margin: 0 auto;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }

      p {
        margin: 0 0 32px;
        color: #969696;
      }

      .cards {
        display: grid;
        gap: 12px;
      }

      .card {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 12px;
        align-items: baseline;
        justify-content: space-between;
        padding: 16px;
        color: inherit;
        text-decoration: none;
        background: #1a1819;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 12px;
      }

      .card:hover {
        border-color: #ea352e;
      }

      .card__title {
        font-size: 18px;
        font-weight: 600;
      }

      .card__package {
        color: #969696;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Swipi playgrounds</h1>
      <p>
        The same playground built against every adapter — these are the pages the
        landing embeds on its playground route.
      </p>
      <div class="cards">${PLAYGROUNDS.map(toCard).join('')}
      </div>
    </main>
  </body>
</html>
`

rmSync(OUTPUT, { recursive: true, force: true })
mkdirSync(OUTPUT, { recursive: true })

PLAYGROUNDS.forEach(buildPlayground)

writeFileSync(resolve(OUTPUT, 'index.html'), buildIndex())
writeFileSync(resolve(OUTPUT, '.nojekyll'), '')

console.error(`built ${PLAYGROUNDS.length} playgrounds into dist-pages`)
