# energese-project.github.io

The homepage for the [Energese Project](https://energese-project.github.io/) — Howard T.
Odum's Energy Systems Language as executable, citable software.

A static site built from the [boba](https://github.com/sholtomaud/boba) template: Vite,
TypeScript, Web Components and Tailwind, with no framework runtime. Every npm command runs
inside an [Apple `container`](Containerfile) image, so the host needs only the `container`
CLI — no local Node.

## Running it

```sh
container system start   # or: make start — once per macOS session
make image               # build the dev image, once
make install             # npm install inside the container

make dev                 # Vite dev server on :5173
make build               # static bundle into dist/
make preview             # serve the built bundle on :4173
```

## Before pushing

```sh
make check               # lint + typecheck + unit tests + Playwright
```

`make check` runs exactly what CI runs: typecheck, unit tests, Playwright. Playwright runs the suite twice: against the Vite dev
server, and against the built bundle served through `serve -s`, which rewrites unknown paths
to `index.html` the way GitHub Pages does. That second pass is what makes the deep-link tests
meaningful.

## Structure

| Path | Role |
|---|---|
| [`index.html`](index.html) | The app shell — nav, router outlet, footer |
| [`src/main.ts`](src/main.ts) | Route table and boot |
| [`src/core/`](src/core/) | Router, base component, store, template helpers |
| [`src/components/`](src/components/) | One directory per component: `.ts` + `.html` + `.css` |
| [`src/data/projects.ts`](src/data/projects.ts) | The organisation's repositories, rendered by `/projects` |
| [`e2e/`](e2e/) | Playwright specs |

## Deployment

`main` deploys to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
The workflow builds, runs the full suite against the artifact, copies `index.html` to
`404.html` so client-side routes survive a direct hit, and publishes `dist/`.

Pages must be configured with **Source: GitHub Actions** in repository settings — the branch-based
source will not run this workflow.

## Licence

MIT.
