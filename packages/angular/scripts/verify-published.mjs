import { execFileSync, spawn, spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ANGULAR_VERSION = '22'

const DEV_PORT = 5196

const DEV_HOST = '127.0.0.1'

const READY_TIMEOUT = 120000

const REBUILD_TIMEOUT = 60000

const args = process.argv.slice(2)

const keepWorkdir = args.includes('--keep')

const manifest = JSON.parse(readFileSync('package.json', 'utf8'))

const workdir = mkdtempSync(join(tmpdir(), 'swipi-angular-consumer-'))

const appDir = join(workdir, 'app')

const cacheDir = join(workdir, 'npm-cache')

const step = (title) => console.log(`\n▸ ${title}`)

const run = (command, commandArgs, options = {}) =>
  execFileSync(command, commandArgs, {
    stdio: 'inherit',
    encoding: 'utf8',
    ...options
  })

const runCaptured = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8',
    ...options
  })

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`

  process.stdout.write(output)

  if (result.status !== 0) {
    throw new Error(`"${commandArgs.join(' ')}" exited with ${result.status}`)
  }

  return output
}

const BROWSER_CONDITION = ['--conditions=browser']

const check = (name, extra = [], nodeArgs = []) =>
  run(process.execPath, [...nodeArgs, join('checks', name), ...extra], {
    cwd: appDir
  })

const delay = (ms) => new Promise((done) => setTimeout(done, ms))

const startDevServer = () => {
  const child = spawn(
    process.execPath,
    [
      join(appDir, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'),
      'serve',
      '--host',
      DEV_HOST,
      '--port',
      String(DEV_PORT)
    ],
    {
      cwd: appDir,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NG_CLI_ANALYTICS: 'false', NO_COLOR: '1' }
    }
  )

  const output = []

  const collect = (chunk) => {
    const text = String(chunk)

    output.push(text)
    process.stdout.write(text)
  }

  child.stdout.on('data', collect)
  child.stderr.on('data', collect)

  const waitForOutput = async (pattern, timeout) => {
    const deadline = Date.now() + timeout

    while (Date.now() < deadline) {
      if (output.join('').includes(pattern)) return

      if (child.exitCode !== null) {
        throw new Error(`the dev server exited before "${pattern}" appeared`)
      }

      await delay(100)
    }

    throw new Error(`the dev server never printed "${pattern}"`)
  }

  const stop = async () => {
    const exited = new Promise((done) => child.once('exit', done))

    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      child.kill('SIGTERM')
    }

    await Promise.race([exited, delay(5000)])
  }

  return { child, output, waitForOutput, stop }
}

const readDevPage = async (path) => {
  const response = await fetch(`http://${DEV_HOST}:${DEV_PORT}${path}`)

  if (!response.ok) {
    throw new Error(`the dev server answered ${response.status} for ${path}`)
  }

  return response.text()
}

const readDevEntry = async () => {
  const page = await readDevPage('/')
  const match = /<script[^>]+src="\/?([^"]+\.js)"/.exec(page)

  if (!match) throw new Error('the dev server serves a page with no entry')

  return readDevPage(`/${match[1]}`)
}

const waitForDevEntry = async (marker, present, timeout) => {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    const entry = await readDevEntry().catch(() => '')

    if (entry.includes(marker) === present) return

    await delay(500)
  }

  throw new Error(
    present
      ? `the dev server never served "${marker}"`
      : `the dev server kept serving "${marker}"`
  )
}

const verifyDevServer = async () => {
  const server = startDevServer()

  try {
    await server.waitForOutput('Local:', READY_TIMEOUT)

    const page = await readDevPage('/')

    if (!page.includes('<app-carousel')) {
      throw new Error('the dev server does not serve the app shell')
    }

    if (!page.includes('<p id="state">0/0/0</p>')) {
      throw new Error(
        'the dev server does not prerender an unmeasured carousel'
      )
    }

    const entry = await readDevEntry()

    if (!entry.includes('deps/@midstem_swipi-angular.js')) {
      throw new Error(
        'vite did not pre-bundle swipi-angular for the dev server'
      )
    }

    if (!entry.includes('_Template(rf, ctx)')) {
      throw new Error('the dev server does not compile the component')
    }

    console.log(
      'dev: the dev server pre-bundles swipi-angular and serves the app'
    )

    const componentPath = join(appDir, 'src', 'carousel.ts')
    const source = readFileSync(componentPath, 'utf8')

    writeFileSync(componentPath, source.replace("'four'", "'four (hot)'"))

    await waitForDevEntry('four (hot)', true, REBUILD_TIMEOUT)

    writeFileSync(componentPath, source)

    await waitForDevEntry('four (hot)', false, REBUILD_TIMEOUT)

    console.log('dev: the carousel module takes an edit without a restart')

    const log = server.output.join('')

    if (/ERROR|Failed to resolve/.test(log)) {
      throw new Error('the dev server reported an error')
    }
  } finally {
    await server.stop()
  }
}

const verifyProductionBuild = () => {
  const log = runCaptured('npm', ['run', 'build'], { cwd: appDir })

  if (/ERROR|✘/.test(log)) {
    throw new Error('the production build reported an error')
  }

  runCaptured('npm', ['run', 'build:unused'], { cwd: appDir })

  check('ssr.js')
  check('client.js', [], BROWSER_CONDITION)
  check('built.js', [], BROWSER_CONDITION)
  check('bundle.js')
}

const main = async () => {
  step('build the library')
  run('npm', ['run', 'build'])

  step('pack the tarball')
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', workdir], {
      encoding: 'utf8'
    })
  )
  const tarball = join(workdir, packed[0].filename)

  console.log(`${packed[0].filename} (${packed[0].files.length} files)`)

  step('scaffold a clean angular app')
  cpSync(resolve('scripts', 'consumer-app'), appDir, { recursive: true })
  console.log(appDir)

  step(`install the tarball on angular ${ANGULAR_VERSION}`)
  run(
    'npm',
    [
      'install',
      '--no-audit',
      '--no-fund',
      '--cache',
      cacheDir,
      tarball,
      `@angular/core@${ANGULAR_VERSION}`
    ],
    { cwd: appDir }
  )

  step(`the entries on angular ${ANGULAR_VERSION}`)
  check('entries.js', [manifest.version])

  step('the dev server')
  await verifyDevServer()

  step('the production build, the prerender and the client')
  verifyProductionBuild()

  console.log(`\nThe published package works in a real app (${appDir}).`)
}

try {
  await main()
} catch (error) {
  console.error(
    `\nThe published package failed a consumer check:\n${error.message}`
  )
  process.exitCode = 1
} finally {
  if (keepWorkdir) {
    console.log(`\nThe consumer app is kept at ${workdir}`)
  } else {
    rmSync(workdir, { recursive: true, force: true })
  }
}
