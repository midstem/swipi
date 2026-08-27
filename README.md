# Swipi

<a href='https://midstem.net'>
  <img src='https://raw.githubusercontent.com/midstem/swipi/main/assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless, framework-agnostic carousel. One engine handles
drag, momentum, snapping, looping and autoplay; a thin adapter hands it to your
framework as a hook, a composable, an action or a signal. The markup, the CSS
and the accessibility stay yours — nothing of ours ends up in your DOM and there
is no stylesheet to import.</p>

## Documentation

For advanced usage, available options, responsive layout specifics, state
management, and accessibility guidelines, please refer to our full documentation
at [https://swipi.midstem.net/docs/](https://swipi.midstem.net/docs/).

## Packages

Every adapter bundles the engine, so you install one package and nothing else.

| Package                                        | Version                          | Size                            | Compared to Embla |
| ---------------------------------------------- | -------------------------------- | ------------------------------- | ----------------- |
| [`@midstem/swipi`](packages/core) — the engine | [![npm][v-core]][npm-core]       | [![size][s-core]][b-core]       | no dependencies   |
| [`@midstem/swipi-react`](packages/react)       | [![npm][v-react]][npm-react]     | [![size][s-react]][b-react]     | ~1.6× smaller     |
| [`@midstem/swipi-vue`](packages/vue)           | [![npm][v-vue]][npm-vue]         | [![size][s-vue]][b-vue]         | ~1.7× smaller     |
| [`@midstem/swipi-svelte`](packages/svelte)     | [![npm][v-svelte]][npm-svelte]   | [![size][s-svelte]][b-svelte]   | ~1.6× smaller     |
| [`@midstem/swipi-angular`](packages/angular)   | [![npm][v-angular]][npm-angular] | [![size][s-angular]][b-angular] | ~2.5× smaller     |

Sizes are gzipped with the framework kept external, and the Embla column
compares each adapter against its `embla-carousel-*` counterpart measured the
same way. Follow a package link for its own README — installation, the wiring
for that framework and the layout contract.

## Playgrounds

Every adapter has a playground of its own, deployed on every push to `main` and
embedded on the [playground page](https://swipi.midstem.net/playground/) of the
documentation site.

| Playground | Try it                                           | Source                                               |
| ---------- | ------------------------------------------------ | ---------------------------------------------------- |
| React      | [live](https://midstem.github.io/swipi/react/)   | [`apps/playground-react`](apps/playground-react)     |
| Vue        | [live](https://midstem.github.io/swipi/vue/)     | [`apps/playground-vue`](apps/playground-vue)         |
| Svelte     | [live](https://midstem.github.io/swipi/svelte/)  | [`apps/playground-svelte`](apps/playground-svelte)   |
| Angular    | [live](https://midstem.github.io/swipi/angular/) | [`apps/playground-angular`](apps/playground-angular) |
| Vanilla JS | [live](https://midstem.github.io/swipi/vanilla/) | [`apps/playground-vanilla`](apps/playground-vanilla) |

All five draw their options, controls and styles from the shared
[`@swipi/playground-core`](packages/playground-core), so the same carousel can
be tried on each adapter and compared side by side.
[midstem.github.io/swipi](https://midstem.github.io/swipi/) links to all of
them.

```bash
npm install
npm start
```

`npm start` opens the React playground; `start:vue`, `start:svelte`,
`start:angular` and `start:vanilla` open the others. `npm run build:pages`
builds all five the way the deployment does.

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## Contributing

We welcome contributions! Please read the [Contributing Guide](CONTRIBUTING.md)
to learn how to set up the project, run checks, and submit pull requests.

## Community

- [Code of Conduct](CODE_OF_CONDUCT.md) — please read before participating
- [Security Policy](SECURITY.md) — how to report vulnerabilities
- [Changelog](CHANGELOG.md) — notable changes across releases

## License

[MIT](LICENSE)

[npm-core]: https://npmjs.org/package/@midstem/swipi
[v-core]: https://img.shields.io/npm/v/%40midstem%2Fswipi.svg
[s-core]: https://deno.bundlejs.com/badge?q=@midstem/swipi&treeshake=%5B%7BcreateSwipi%7D%5D
[b-core]: https://bundlejs.com/?q=%40midstem%2Fswipi&treeshake=%5B%7BcreateSwipi%7D%5D
[npm-react]: https://npmjs.org/package/@midstem/swipi-react
[v-react]: https://img.shields.io/npm/v/%40midstem%2Fswipi-react.svg
[s-react]: https://deno.bundlejs.com/badge?q=@midstem/swipi-react&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D
[b-react]: https://bundlejs.com/?q=%40midstem%2Fswipi-react&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D
[npm-vue]: https://npmjs.org/package/@midstem/swipi-vue
[v-vue]: https://img.shields.io/npm/v/%40midstem%2Fswipi-vue.svg
[s-vue]: https://deno.bundlejs.com/badge?q=@midstem/swipi-vue&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22vue%22%5D%7D%7D
[b-vue]: https://bundlejs.com/?q=%40midstem%2Fswipi-vue&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22vue%22%5D%7D%7D
[npm-svelte]: https://npmjs.org/package/@midstem/swipi-svelte
[v-svelte]: https://img.shields.io/npm/v/%40midstem%2Fswipi-svelte.svg
[s-svelte]: https://deno.bundlejs.com/badge?q=@midstem/swipi-svelte&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22svelte%22%2C%22svelte%2Fstore%22%5D%7D%7D
[b-svelte]: https://bundlejs.com/?q=%40midstem%2Fswipi-svelte&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22svelte%22%2C%22svelte%2Fstore%22%5D%7D%7D
[npm-angular]: https://npmjs.org/package/@midstem/swipi-angular
[v-angular]: https://img.shields.io/npm/v/%40midstem%2Fswipi-angular.svg
[s-angular]: https://deno.bundlejs.com/badge?q=@midstem/swipi-angular&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22%40angular%2Fcore%22%5D%7D%7D
[b-angular]: https://bundlejs.com/?q=%40midstem%2Fswipi-angular&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22%40angular%2Fcore%22%5D%7D%7D
