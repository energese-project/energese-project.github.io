# AGENTS.md

The standard for this repository. Read it before changing anything.

## 1. What this is

The public homepage for the `energese-project` organisation. It is a static site: no server,
no database, no API. Its job is to state what the project is trying to do and to point at the
three repositories that do it.

It is an **organisation** Pages site, served from the domain root
(`https://energese-project.github.io/`), not from `/<repo>/`. Two things follow, and both have
already been got wrong once in the template this was built from:

- `base` in [`vite.config.js`](vite.config.js) is `/`, not `./`. A relative base resolves asset
  URLs against the *requested* path, so `/projects` would ask for `/projects/assets/index.js`
  and get a 404.
- `window.BOBA_BASE_URL` is hard-coded to `/` in [`src/main.ts`](src/main.ts). Boba derives it
  from the first path segment, which is right for a project site and wrong here — it would read
  `projects` as the repository name.

## 2. Stack

Vite, TypeScript, Web Components, Tailwind v4. No framework runtime, no client-side
dependencies at all. Keep it that way: a homepage that needs a bundle of libraries to render
four pages of prose has lost the argument.

## 3. Everything runs in the container

The host is not assumed to have Node. Every npm command goes through the Apple `container`
image defined in [`Containerfile`](Containerfile), driven by the [`Makefile`](Makefile). Run
`make help` for the targets.

The Playwright version appears in three places — `package.json`, `Containerfile`, and the
`container:` image in both workflows. **They move together, and the one in `package.json`
carries no caret.** The browser binary lives in the two images, neither of which is governed by
`package-lock.json`, so `^1.61.1` was free to resolve to 1.63.0 while the image still held the
browser build 1.61.1 wanted. Every test then failed with

```
Executable doesn't exist at .../chromium_headless_shell-1243/...
```

which reads like a broken suite and is really a version skew. Bumping Playwright means editing
all three strings and rebuilding the image with `make image`.

## 4. Before pushing

```sh
make check
```

That is typecheck, unit tests and the full Playwright suite — the same three things CI runs,
in the same order. All must pass with zero errors.

There is no ESLint. `tsc --noEmit` runs with `strict`, `noUnusedLocals` and
`noUnusedParameters`, which is the gate; a linter on top of that would be five dependencies
buying style rules. Do not add one back without a defect it would have caught.

## 5. Push *and* open a PR

CI runs on `pull_request`. A pushed branch with no PR has been tested by nothing. Do not stop
at the push, and do not merge your own PR — hand over a green one.

A task is done when it is **merged**, not when it is written.

## 6. Branches

`feat/`, `fix/`, `docs/`, `chore/`. The `pull_request` trigger in
[`ci.yml`](.github/workflows/ci.yml) lists all four as permitted bases, so a PR stacked on
another branch still runs the jobs. Adding a fifth prefix means adding it there too, or PRs
against it are silently unverified.

## 7. Components

One directory per component under `src/components/`, containing three files:

```
src/components/thing-page/
  thing-page.ts     # class extending BaseComponent, registers the custom element
  thing-page.html   # imported with ?raw
  thing-page.css    # imported with ?raw; :host is rewritten to the tag name
```

Conventions:

- Custom element tags are kebab-case, and the class exposes the tag as `static tagName`.
- Imports carry the `.ts` extension. This is mandatory, not stylistic.
- Register with the `if (!customElements.get(...))` guard — a hot reload otherwise throws on
  re-registration.
- A new route component must be imported in [`src/main.ts`](src/main.ts) as well as registered
  in the route table. The router does not lazy-load: it looks the tag up in `customElements` and
  renders the 404 view if nothing is there. See the comment on `loadComponent` for why.
- Internal links (`href="/..."`) must be passed to `bindInternalLinks(this)` in `init()`.
  Without it the browser does a full document load; it works, because 404.html is a copy of
  index.html, but the whole app reloads.

## 8. Content standards

The project's claims about its own limits are load-bearing, not decoration. The research page
states where the kernel is *not yet* a faithful implementation of the emergy algebra, and
[`e2e/content.spec.ts`](e2e/content.spec.ts) asserts that sentence is still there. Do not
tighten that prose into a claim the software does not support. If the underlying situation
changes, change the paper first and the page second.

Repository facts — DOIs, links, blurbs — live in
[`src/data/projects.ts`](src/data/projects.ts), not scattered through markup.

## 9. Design tokens

The palette lives in [`src/styles/energese.css`](src/styles/energese.css) and
**this is the canonical copy**. A byte-identical duplicate sits in the GSSK
repository at `web/energese.css`, where it styles the docs site and the WASM
demo.

Duplicated rather than published as a package, deliberately: GSSK's demo has no
build step — its deploy workflow copies `web/index.html` into the Pages artifact
as a raw file — so a shared package would mean adding npm to a C99 kernel whose
releases are archived and citable. The file's header states this, and carries
`--e-tokens-version` so a stale copy is visible rather than silent.

**Changing a colour is a two-repository change.** Edit this copy, bump
`--e-tokens-version`, copy the whole file to GSSK, and open a PR in both. Never
patch one side in place — `diff` should report the two files identical, header
included.

Two rules that are not stylistic:

- **`--e-series-1` … `--e-series-8` and their order** are a colour-blindness
  safety mechanism, chosen by running candidate orderings through a validator
  and keeping only those clearing every adjacent-pair gate in both modes.
  Reordering or extending them breaks that silently — the chart still renders.
- **Nothing may hardcode a colour.** `bg-white`, `text-white` and `fill="#fff"`
  all survive a token migration untouched and then glow white on a dark page.
  The pipeline diagram shipped exactly that bug;
  [`e2e/theming.spec.ts`](e2e/theming.spec.ts) is what caught it and what keeps
  it out.

Anything that pairs a foreground with a background must use tokens that
**invert together**. The primary button is `--e-accent` on `--e-ground`, not
white on `--e-ink`: `--e-ink` is near-white in dark mode, so the second pairing
inverts into white-on-white.

## 10. Deployment

`main` → [`deploy.yml`](.github/workflows/deploy.yml) → GitHub Pages. The workflow copies
`dist/index.html` to `dist/404.html`; that copy is the only reason a client-side route survives
being entered directly. It also writes `.nojekyll`, without which Jekyll drops files whose
names begin with an underscore.

Repository settings must have **Pages → Source: GitHub Actions**.
