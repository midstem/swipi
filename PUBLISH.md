# Publishing

This repository publishes one package per framework — `swipi` (React) from
`packages/react`, `swipi-vue` from `packages/vue` — and each one is released on
its own. They share the `@swipi/core` engine, which is private and never
published: every adapter inlines it at build time, so a core change only reaches
users through an adapter release.

**Versions are independent.** A bug in the Vue adapter is a `swipi-vue` patch and
leaves `swipi` alone. The two numbers are free to drift, and they will.

## The tag names the package

A release tag is the npm coordinate of exactly one package:

```
swipi@3.1.1
swipi-vue@1.0.0
```

This is the same convention Lerna's independent mode and Changesets use in a
monorepo, and the reason a bare `v3.1.1` no longer works: with two packages in
the tree it does not say what was released. The tags that already exist
(`v1.1.5` … `v3.1.0`) are the React package's history from when it was the only
package; leave them alone.

`.github/scripts/check-release-version.sh` parses the tag, refuses anything that
is not `<npm name>@<version>`, refuses private workspaces, and fails the release
unless the version in that package's `package.json` matches the tag exactly.
Nothing else in the workflow decides which package goes out.

## 1. Prepare the release branch

- bump `version` in the package you are releasing — `packages/react/package.json`
  **or** `packages/vue/package.json`, not both;
- update `MIGRATION.md` and the package's `README.md` if its public API moved.

Releasing both adapters after a core change is two bumps, two tags and two
releases. They are independent, so the order does not matter.

## 2. Check it locally

The cheap gates cover the whole monorepo:

```bash
npm run lint && npm run typecheck && npm run test:run && npm run build && npm run verify:package && npm run typecheck:package
```

The consumer gate is per package, so run the one you are releasing:

```bash
npm run verify:published --workspace swipi-vue
```

It packs the tarball, installs it into a throwaway Vite app for that framework
and runs it the way a consumer does — entries, SSR, client mount, dev server with
HMR, production build, tree-shaking — on both ends of the supported peer range
(React 19 and 18; Vue 3.5 and 3.2). It is the last gate before the release. Drop
the `--workspace` flag to run every package's gate; add `-- --keep` to keep the
generated app around for a look.

## 3. Merge into `main`

The `Validation of publication readiness` workflow runs the consumer gate for
every package on CI. Wait for it to go green.

## 4. Create the GitHub release

```bash
gh release create swipi-vue@1.0.0 --target main --title "swipi-vue@1.0.0" --generate-notes
```

`--generate-notes` lists every pull request merged since the previous tag in the
repository — which, with two packages releasing on their own cadence, is
probably the _other_ package's tag. Point it at this package's previous release
instead:

```bash
gh release create swipi-vue@1.1.0 --target main --title "swipi-vue@1.1.0" \
  --generate-notes --notes-start-tag swipi-vue@1.0.0
```

Add `--notes` to put a summary above that list — for a major, the PR list says
nothing about what broke:

```bash
gh release create swipi@3.0.0 --target main --title "swipi@3.0.0" --generate-notes \
  --notes "The \`<Swipi>\` component is gone — \`useSwipiCarousel\` replaces it. See [MIGRATION.md](https://github.com/midstem/swipi/blob/main/MIGRATION.md)."
```

A prerelease version (anything with a hyphen, `1.0.0-beta.1`) is published on
npm's `next` dist-tag instead of `latest`, so `npm install swipi-vue` keeps
resolving to the last stable release. Mark the GitHub release as a prerelease
too, with `--prerelease`.

## 5. What the release workflow does

Publishing the release starts the `build` workflow, which:

1. reads the package name and the npm dist-tag out of the tag, and checks the
   version against `package.json`;
2. runs lint, typecheck, tests and the build for the whole repository;
3. runs `verify:package`, `typecheck:package` and the consumer gate **for the
   released package only**;
4. runs `npm publish --workspace <package> --tag <latest|next>`.

## 6. Confirm

```bash
npm view swipi-vue version
```

A version that is already on npm cannot be republished. If a release goes out
broken, fix it forward with the next patch — there is nothing to roll back to.
