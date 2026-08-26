import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const REPORT = 'vitest-report.json'

const ROOTS = ['packages', 'apps']

const LIMIT = 50

const args = process.argv.slice(2)

const readOption = (name) => {
  const index = args.indexOf(name)

  return index === -1 ? undefined : args[index + 1]
}

const reportPaths = () =>
  ROOTS.filter(existsSync)
    .flatMap((root) =>
      readdirSync(root).map((entry) => resolve(root, entry, REPORT))
    )
    .filter(existsSync)

const firstLine = (messages) =>
  (messages ?? [])
    .join('\n')
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

const collectFailures = (path) => {
  const report = JSON.parse(readFileSync(path, 'utf8'))

  return (report.testResults ?? []).flatMap((suite) => {
    const file = relative(process.cwd(), suite.name)

    const failed = (suite.assertionResults ?? [])
      .filter((test) => test.status === 'failed')
      .map((test) => ({
        file,
        name: [...test.ancestorTitles, test.title].join(' › '),
        reason: firstLine(test.failureMessages)
      }))

    if (failed.length || suite.status !== 'failed') return failed

    return [
      {
        file,
        name: 'the suite failed to run',
        reason: firstLine([suite.message])
      }
    ]
  })
}

const failures = reportPaths().flatMap(collectFailures)

if (!failures.length) process.exit(0)

const name = readOption('--name')

const byFile = failures.slice(0, LIMIT).reduce((groups, failure) => {
  groups[failure.file] ??= []
  groups[failure.file].push(failure)

  return groups
}, {})

const lines = name ? [`### ${name}`, ''] : []

Object.entries(byFile).forEach(([file, entries]) => {
  lines.push(`**\`${file}\`**`, '')

  entries.forEach(({ name: test, reason }) =>
    lines.push(`- ${test}`, ...(reason ? [`  \`${reason}\``] : []))
  )

  lines.push('')
})

if (failures.length > LIMIT) {
  lines.push(`_and ${failures.length - LIMIT} more failing test(s)._`, '')
}

console.log(lines.join('\n').trimEnd())
