# @swipi/playground-angular

A local playground environment for testing the Swipi Angular adapter.

## Getting Started

To run the playground locally, you can use either of the following commands from the root of the monorepo:

```bash
npm run start --workspace @swipi/playground-angular
```

Or, if you are inside the `apps/playground-angular` directory:

```bash
npm run start
```

## The Angular setup

The stand runs on Vite like every other playground here, so
[`@analogjs/vite-plugin-angular`](https://www.npmjs.com/package/@analogjs/vite-plugin-angular)
compiles the components ahead of time — signal inputs and outputs need that
compilation, the JIT compiler alone never sees them. The plugin reads
`tsconfig.json` and emits through it, which is why this app is the one that
leaves `noEmit` out; `npm run typecheck` passes the flag on the command line
instead.

The adapter itself carries no decorator and no template, so none of this
reaches it — `useSwipiCarousel` is plain TypeScript and drops into an AOT build
of your own app as it is.
