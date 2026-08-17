# release

The interactive release CLI for this monorepo. Every package is published on its
own version and its own tag (`swipi@3.1.1`, `swipi-vue@1.0.0`), and this script
is what picks the package, writes the version and creates the tagged GitHub
release — so nobody has to type a tag by hand and get it wrong.

## Running it

```bash
npm run release
```

```bash
npm run release -- --dry-run
```

The dry run walks the same path, writes nothing, and prints the `gh` command it
would have used. `npm run release --dry-run` works too — npm keeps that flag for
itself instead of forwarding it, so the script reads `npm_config_dry_run` as
well.

## What it does

It lists the publishable workspaces with their local and published versions, asks
which one you mean, and then takes whichever half of the release is due:

- **the local version is already on npm** — it offers patch, minor, major,
  prerelease or a version you type, then writes it to that package's
  `package.json` and to the single `package-lock.json` line that repeats it;
- **the local version is not on npm yet** — it checks that you are on `main`,
  clean, in sync with `origin`, that `HEAD` carries that version, and that
  neither the tag nor the release exists, then creates the release once you
  confirm.

A release is therefore two runs: one to bump, one to tag. Publishing is the
`build` workflow's job — it reads the package out of the tag and runs `npm
publish` after the gates. See [PUBLISH.md](../../PUBLISH.md) for the whole flow.

## Layout

`index.mjs` holds the flow and nothing else. The pieces live in `modules/`, each
with its own `constants.mjs` and `helpers.mjs` where it needs them:

| module                   | does                                           |
| ------------------------ | ---------------------------------------------- |
| `shell`, `log`, `prompt` | running commands, output, questions            |
| `workspaces`, `registry` | which packages exist, what npm already has     |
| `version`, `manifest`    | version arithmetic, writing the bump           |
| `tags`, `preflight`      | the previous tag, everything that must be true |
| `bump`, `release`        | the two halves of the flow                     |
