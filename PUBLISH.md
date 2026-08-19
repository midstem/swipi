# Publishing

This repository publishes the engine and one package per framework under the
`@midstem` scope — `@midstem/swipi` from `packages/core`,
`@midstem/swipi-react` from `packages/react`, `@midstem/swipi-vue` from
`packages/vue`, `@midstem/swipi-svelte` from `packages/svelte`,
`@midstem/swipi-angular` from `packages/angular` — and each one is released on
its own.

`@midstem/swipi` is the engine itself: the plain-JavaScript entry for consumers
on no framework, and the base for anyone writing an adapter we do not ship. The
four adapters are built on it and **inline it at build time** rather than
declaring it as a dependency, so a consumer never ends up with two copies of the
engine and the versions never have to line up. An engine change therefore
reaches adapter users only through an adapter release, and reaches the engine's
own users through an engine release.

**The engine's public API is its `src/index.ts`, and only that.** It exports
`createSwipi`, `resolveOptions` and the public types — the exact surface every
adapter here is written against. Everything else under `packages/core/src` is
internal: the modules import each other through the `#src/*` map, not through
the entry, so geometry, math, drag and the rest can be reshaped without a major.
Adding to the entry is a minor; changing what is already there is a major.

Inside the repository nothing waits for the engine to be built. Three settings
arrange that, and a new package that imports the engine needs all three:

- `resolve.alias` in its `vite.config.ts` maps `@midstem/swipi` to
  `packages/core/src/index.ts`, so builds and tests run against the engine's
  source rather than against the last `npm run build`;
- `paths` does the same for TypeScript — repo-wide in `tsconfig.base.json`, and
  repeated in the playground apps because a `paths` block in a child config
  replaces the inherited one instead of merging with it. Without it `npm run
lint` and `npm run typecheck` fail on a fresh clone with a wall of
  `no-unsafe-*`, because the engine's types resolve only through its `dist`;
- `compilerOptions: { paths: {} }` inside `dts()` switches those paths back off
  for the declaration build, which needs the engine's published `.d.ts`. Left
  on, it pulls the engine's sources into the program and `tsc` refuses them with
  `TS6059: not under rootDir`.

For the same reason the packages' own `tsconfig.json` files are typecheck-only
(`noEmit`): the emit paths belong to Vite, and an emitting config would hit the
same `rootDir` complaint.

**Versions are independent.** A bug in the Vue adapter is a
`@midstem/swipi-vue` patch and leaves the React, Svelte and Angular packages
alone. The numbers are free to drift, and they will.

The unscoped `swipi` package on npm is the pre-scope history of the React
adapter, frozen at `3.1.0`. Every scoped package starts again at `1.0.0`.

## The tag names the package

A release tag is the npm coordinate of exactly one package:

```
@midstem/swipi@1.0.0
@midstem/swipi-react@1.0.1
@midstem/swipi-vue@1.0.0
@midstem/swipi-svelte@1.0.0
@midstem/swipi-angular@1.0.0
```

This is the same convention Lerna's independent mode and Changesets use in a
monorepo, and the reason a bare `v1.0.1` no longer works: with several packages
in the tree it does not say what was released. The tags that already exist
(`v1.1.5` … `v3.1.0`) are the React package's history from when it was the only
package; leave them alone.

`.github/scripts/release-tag.mjs` parses the tag, refuses anything that
is not `<npm name>@<version>`, refuses private workspaces, and fails the release
unless the version in that package's `package.json` matches the tag exactly.
Nothing else in the workflow decides which package goes out.

## The CLI does all of this

```bash
npm run release
```

It lists the publishable packages with their local and published versions, asks
which one you mean, and then does whichever half of the job is due:

- **the local version is already on npm** — it offers patch, minor, major,
  prerelease or a version you type, writes it to that package's `package.json`
  and to the one line of `package-lock.json` that carries it, and prints the git
  commands for getting it onto `main`;
- **the local version is not on npm yet** — it checks that you are on `main`,
  clean, in sync with `origin`, that `HEAD` really carries that version, and
  that neither the tag nor the release exists; asks for an optional line to put
  above the generated notes; shows the exact tag, target commit and dist-tag,
  and creates the release once you confirm.

So a release is two runs: one to bump, one to tag. `npm run release -- --dry-run`
walks the same path and writes nothing — it prints the `gh` command it would
have run.

Everything below is what the CLI does on your behalf, for when you want to do it
by hand or need to fix something it refuses to touch.

## 1. Prepare the release branch

- bump `version` in the package you are releasing — one of
  `packages/core/package.json`, `packages/react/package.json`,
  `packages/vue/package.json`, `packages/svelte/package.json` or
  `packages/angular/package.json`, never more than one;
- keep `package-lock.json` in step: the `packages/<dir>` entry repeats that
  version, and `npm ci` fails when the two disagree. `npm run release` edits that
  one line for you;
- update the package's `README.md` if its public API moved.

Releasing every package after a core change is one bump, one tag and one release
each. They are independent, so the order does not matter.

## 2. Check it locally

The cheap gates cover the whole monorepo:

```bash
npm run lint && npm run typecheck && npm run test:run && npm run build && npm run verify:package && npm run typecheck:package
```

The consumer gate is per package, so run the one you are releasing:

```bash
npm run verify:published --workspace @midstem/swipi-vue
```

It packs the tarball, installs it into a throwaway app for that framework and
runs it the way a consumer does — entries, SSR, client mount, dev server with
HMR, production build, tree-shaking. React and Vue run it on both ends of the
supported peer range (React 19 and 18; Vue 3.5 and 3.2); the Svelte app needs
`@sveltejs/vite-plugin-svelte`, which only supports Svelte 5, so the Svelte 4
end of that range is covered by the `svelte-compatibility` CI job instead, which
runs the adapter's own tests and its public-API typecheck on Svelte 4. It is the
last gate before the release. Drop
the `--workspace` flag to run every package's gate; add `-- --keep` to keep the
generated app around for a look.

The `@midstem/swipi` app is the plain one: there is no framework to render on
the server, so in place of an SSR check it asserts that importing the entry in
bare Node reaches `createSwipi` without touching a DOM, and in place of a hot
boundary it asserts that an edit to the entry reaches the browser as a reload —
a plain module has no boundary to stay inside. Everything else is the same
sequence: entries, a client mount in jsdom, the dev server, the production build
and tree-shaking.

The Angular app is the odd one out: it is built by the Angular CLI rather than
by Vite directly, because AOT is the thing worth proving for an Angular package.
Its gate installs `@angular/build`, prerenders the app with `@angular/ssr` — the
prerender is where a server-side DOM access would surface — and then runs the
production bundle twice in jsdom, once as a fresh client mount off
`index.csr.html` and once hydrating the prerendered `index.html`. Two things it
does not do that the other three do: it asserts that the dev server picks an
edit up without a restart rather than that the edit stays inside a hot boundary,
because Angular answers a component edit with a page reload; and it runs on
Angular 22 only, because the test harness needs `platformBrowserTesting`, which
`@angular/platform-browser/testing` only grew in Angular 20. The Angular 17 end
of the peer range is covered by the `angular-compatibility` CI job, which
typechecks the public API against it.

## 3. Merge into `main`

The `Validation of publication readiness` workflow runs the consumer gate for
every package on CI. Wait for it to go green.

## 4. Create the GitHub release

```bash
gh release create @midstem/swipi-vue@1.0.0 --target main --title "@midstem/swipi-vue@1.0.0" --generate-notes
```

`--generate-notes` lists every pull request merged since the previous tag in the
repository — which, with several packages releasing on their own cadence, is
probably another package's tag. Point it at this package's previous release
instead (the CLI reads it from `git tag --list "<package>@*"`, falling back to
the legacy `v*` tags for `@midstem/swipi-react`):

```bash
gh release create @midstem/swipi-vue@1.1.0 --target main --title "@midstem/swipi-vue@1.1.0" \
  --generate-notes --notes-start-tag @midstem/swipi-vue@1.0.0
```

Add `--notes` to put a summary above that list — for a major, the PR list says
nothing about what broke:

```bash
gh release create @midstem/swipi-react@2.0.0 --target main --title "@midstem/swipi-react@2.0.0" --generate-notes \
  --notes "\`useSwipiCarousel\` now returns a reactive object instead of a tuple — see the README for the new shape."
```

A prerelease version (anything with a hyphen, `1.0.0-beta.1`) is published on
npm's `next` dist-tag instead of `latest`, so `npm install @midstem/swipi-vue` keeps
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
npm view @midstem/swipi-vue version
```

A version that is already on npm cannot be republished. If a release goes out
broken, fix it forward with the next patch — there is nothing to roll back to.
