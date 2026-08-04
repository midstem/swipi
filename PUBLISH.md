# Publishing

## 1. Prepare the release branch

- bump `version` in `package.json`;
- update `MIGRATION.md` and `README.md` if the public API moved.

## 2. Check it locally

```bash
npm run lint && npm run typecheck && npm run test:run && npm run build && npm run verify:package && npm run typecheck:package
```

```bash
npm run verify:published
```

The second one packs the tarball, installs it into a throwaway Vite + React app
and runs it the way a consumer does — entries, SSR, StrictMode, dev with HMR,
production build. It is the last gate before the release; see the "Before
publishing" section of the README for what it covers.

## 3. Merge into `main`

The `Validation of publication readiness` workflow runs the same consumer gate
on CI. Wait for it to go green.

## 4. Create the GitHub release

```bash
gh release create v3.0.0 --target main --title "v3.0.0" --generate-notes
```

Swap `3.0.0` for the version in `package.json`. The tag carries a `v` prefix and
the version in `package.json` does not — anything else fails the first step.

`--generate-notes` lists every pull request merged since the previous tag, which
for a major says nothing about what broke. Add `--notes` to put a summary above
that list:

```bash
gh release create v3.0.0 --target main --title "v3.0.0" --generate-notes \
  --notes "The \`<Swipi>\` component is gone — \`useSwipiCarousel\` replaces it. See [MIGRATION.md](https://github.com/midstem/swipi/blob/main/MIGRATION.md)."
```

Publishing the release starts the `build` workflow, which checks the tag against
`package.json`, runs lint, typecheck, tests, the build, both package checks and
the consumer gate, and only then runs `npm publish`.

## 5. Confirm

```bash
npm view swipi version
```

A version that is already on npm cannot be republished. If a release goes out
broken, fix it forward with the next patch — there is nothing to roll back to.
