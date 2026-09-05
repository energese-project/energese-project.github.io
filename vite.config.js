import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// `base` is '/' and not './'.
//
// This is an organisation Pages site served from the domain root
// (https://energese-project.github.io/), not a project site served from
// /<repo>/. A relative base emits asset URLs relative to the *requested*
// path, so a deep link like /projects would resolve ./assets/index.js
// against /projects/ and 404. Every route is served the same document — see
// the 404.html copy in .github/workflows/deploy.yml — so the asset paths in
// it have to be absolute for that document to work at any depth.
export default defineConfig({
  base: '/',
  // Tailwind v4's own Vite plugin. The PostCSS route needs postcss.config.js,
  // a `postcss` dependency and an `autoprefixer` that v4 has made redundant —
  // it prefixes through Lightning CSS itself.
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
