export interface Project {
  name: string;
  role: string;
  blurb: string;
  language: string;
  repo: string;
  links: { label: string; href: string }[];
}

// The repositories of the energese-project organisation, in the order they sit
// in the pipeline: kernel, then the two things that consume a model.
export const projects: Project[] = [
  {
    name: 'GSSK',
    role: 'The kernel',
    blurb:
      'A C99 numerical engine for the Energy Systems Language. A model is a JSON description of storages, sources, sinks and pathways; GSSK integrates the resulting system of ODEs — Euler, RK4, or adaptive Dormand–Prince — and tracks energy, material, money and information over the same network, with emergy and transformity accounting and deterministic snapshot/replay.',
    language: 'C99 · WASM · Python · Swift',
    repo: 'https://github.com/energese-project/GSSK',
    links: [
      { label: 'Documentation', href: 'https://energese-project.github.io/GSSK/' },
      { label: 'Interactive demo', href: 'https://energese-project.github.io/GSSK/demo/' },
      { label: 'DOI 10.5281/zenodo.22339312', href: 'https://doi.org/10.5281/zenodo.22339312' },
    ],
  },
  {
    name: 'latex-energese',
    role: 'The diagram',
    blurb:
      "Odum's symbol vocabulary as a LuaLaTeX package. Describe a system once, in JSON or in TeX, and the figure is drawn from it — symbols measured against Odum's published sheet, components placed by transformity, pathways routed around what they do not connect to. The diagram is a function of the model, so it cannot drift from it.",
    language: 'LuaLaTeX · Lua',
    repo: 'https://github.com/energese-project/latex-energese',
    links: [
      { label: 'DOI 10.5281/zenodo.22340275', href: 'https://doi.org/10.5281/zenodo.22340275' },
    ],
  },
  {
    name: 'gssk-dia',
    role: 'The editor',
    blurb:
      'A browser diagram editor. Draw a system as sources, storages, producers, consumers and the flows between them, then press run: the GSSK WebAssembly build integrates it and streams node states back onto the diagram and into a time-series chart. Simulation is not reimplemented in JavaScript — it is the same kernel.',
    language: 'TypeScript · WASM',
    repo: 'https://github.com/energese-project/gssk-dia',
    links: [],
  },
];
