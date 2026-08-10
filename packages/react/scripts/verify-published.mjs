import { execFileSync, spawn } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const REACT_VERSIONS = ['19', '18']

const DEV_PORT = 5199

const DEV_HOST = '127.0.0.1'

const READY_TIMEOUT = 60000

const HMR_TIMEOUT = 20000

const args = process.argv.slice(2)

const keepWorkdir = args.includes('--keep')

const manifest = JSON.parse(readFileSync('package.json', 'utf8'))

const workdir = mkdtempSync(join(tmpdir(), 'swipi-consumer-'))

const appDir = join(workdir, 'app')

const cacheDir = join(workdir, 'npm-cache')

const step = (title) => console.log(`\n▸ ${title}`)

const run = (command, commandArgs, options = {}) =>
  execFileSync(command, commandArgs, {
    stdio: 'inherit',
    encoding: 'utf8',
    ...options
  })

const check = (name, extra = []) =>
  run(process.execPath, [join('checks', name), ...extra], { cwd: appDir })

const delay = (ms) => new Promise((done) => setTimeout(done, ms))

const startDevServer = () => {
  const child = spawn(
    process.execPath,
    [
      join(appDir, 'node_modules', 'vite', 'bin', 'vite.js'),
      '--host',
      DEV_HOST,
      '--port',
      String(DEV_PORT),
      '--strictPort'
    ],
    { cwd: appDir, stdio: ['ignore', 'pipe', 'pipe'] }
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

  return { child, output, waitForOutput }
}

const readDevPage = async (path) => {
  const response = await fetch(`http://${DEV_HOST}:${DEV_PORT}${path}`)

  if (!response.ok) {
    throw new Error(`the dev server answered ${response.status} for ${path}`)
  }

  return response.text()
}

const openHmrSocket = async () => {
  const socket = new WebSocket(`ws://${DEV_HOST}:${DEV_PORT}/`, 'vite-hmr')
  const payloads = []

  socket.addEventListener('message', (event) => {
    payloads.push(JSON.parse(event.data))
  })

  await new Promise((done, fail) => {
    socket.addEventListener('open', done, { once: true })
    socket.addEventListener('error', fail, { once: true })
  })

  const waitForPayload = async (matches, timeout) => {
    const deadline = Date.now() + timeout

    while (Date.now() < deadline) {
      const payload = payloads.find(matches)

      if (payload) return payload

      await delay(50)
    }

    throw new Error('the dev server sent no matching hmr payload')
  }

  return { socket, payloads, waitForPayload }
}

const verifyDevServer = async () => {
  const server = startDevServer()

  try {
    await server.waitForOutput('ready in', READY_TIMEOUT)

    const page = await readDevPage('/')

    if (!page.includes('id="root"')) {
      throw new Error('the dev server does not serve the app shell')
    }

    const entry = await readDevPage('/src/main.jsx')

    if (!entry.includes('createRoot')) {
      throw new Error('the dev server does not transform the app entry')
    }

    const component = await readDevPage('/src/Carousel.jsx')

    if (!component.includes('deps/swipi.js')) {
      throw new Error('vite did not pre-bundle swipi for the dev server')
    }

    console.log('dev: the dev server pre-bundles swipi and serves the app')

    const hmr = await openHmrSocket()
    const componentPath = join(appDir, 'src', 'Carousel.jsx')
    const source = readFileSync(componentPath, 'utf8')

    writeFileSync(componentPath, source.replace("'four'", "'four (hot)'"))

    const update = await hmr.waitForPayload(
      (payload) =>
        payload.type === 'update' &&
        payload.updates.some(
          (entry) =>
            entry.type === 'js-update' && entry.path === '/src/Carousel.jsx'
        ),
      HMR_TIMEOUT
    )

    const reload = hmr.payloads.find(
      (payload) => payload.type === 'full-reload'
    )

    if (reload) {
      throw new Error('the carousel module fell out of its refresh boundary')
    }

    const hot = await readDevPage(
      `/src/Carousel.jsx?t=${update.updates[0].timestamp}`
    )

    if (!hot.includes('four (hot)')) {
      throw new Error('the hot update does not carry the edit')
    }

    hmr.socket.close()
    writeFileSync(componentPath, source)

    console.log('dev: the carousel module takes a hot update, not a reload')

    const log = server.output.join('')

    if (/Internal server error|Failed to resolve/.test(log)) {
      throw new Error('the dev server reported an error')
    }
  } finally {
    server.child.kill('SIGTERM')

    await delay(200)
  }
}

const verifyProductionBuild = () => {
  run('npm', ['run', 'build'], { cwd: appDir })
  run('npm', ['run', 'build:unused'], { cwd: appDir })

  check('built.js')
  check('bundle.js')
}

const installReact = (version) =>
  run(
    'npm',
    [
      'install',
      '--no-audit',
      '--no-fund',
      '--cache',
      cacheDir,
      `react@${version}`,
      `react-dom@${version}`
    ],
    { cwd: appDir }
  )

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

  step('scaffold a clean vite app')
  cpSync(resolve('scripts', 'consumer-app'), appDir, { recursive: true })
  console.log(appDir)

  step(`install the tarball on react ${REACT_VERSIONS[0]}`)
  run(
    'npm',
    [
      'install',
      '--no-audit',
      '--no-fund',
      '--cache',
      cacheDir,
      tarball,
      `react@${REACT_VERSIONS[0]}`,
      `react-dom@${REACT_VERSIONS[0]}`
    ],
    { cwd: appDir }
  )

  step(`entries, ssr and client on react ${REACT_VERSIONS[0]}`)
  check('entries.js', [manifest.version])
  check('ssr.js')
  check('client.js')

  step('the dev server')
  await verifyDevServer()

  step('the production build')
  verifyProductionBuild()

  for (const version of REACT_VERSIONS.slice(1)) {
    step(`install react ${version}`)
    installReact(version)

    step(`entries, ssr and client on react ${version}`)
    check('entries.js', [manifest.version])
    check('ssr.js')
    check('client.js')
  }

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
