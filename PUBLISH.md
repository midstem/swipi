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

Tag it with the version from `package.json` like `3.0.0`, anything else fails the first step.

Publishing the release starts the `build` workflow, which checks the tag against
`package.json`, runs lint, typecheck, tests, the build, both package checks and
the consumer gate, and only then runs `npm publish`.

## 5. Confirm

```bash
npm view swipi version
```

A version that is already on npm cannot be republished. If a release goes out
broken, fix it forward with the next patch — there is nothing to roll back to.
