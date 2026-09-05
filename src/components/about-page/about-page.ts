import { BaseComponent, html } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import template from './about-page.html?raw';
import style from './about-page.css?raw';

// Odum's fundamental symbol set (Fig 1.2a), plus `constant`, which has no Odum
// symbol. Kept in sync with the node taxonomy in the GSSK docs.
const symbols: [string, string, string][] = [
  ['Circle with arrow', 'Source — outside source of inflows', 'source'],
  ['Closed tank', 'Storage — accumulates state Q', 'storage'],
  ['Ground symbol', 'Heat sink — pathway of used energy', 'sink'],
  ['Arrowhead (×)', 'Interaction — production process, work gate', 'interaction'],
  ['Triangle', 'Constant gain amplifier — output ∝ control input', 'gain'],
  ['D-shape', 'Loop-limited converter — Michaelis–Menten recycling', 'loop_limited'],
  ['Diamond', 'Exchange — couples two carrier flows via price', 'exchange'],
  ['Hourglass', 'Switch — on/off threshold process', 'switch'],
  ['(none)', 'Constant — fixed reference value', 'constant'],
];

export class AboutPage extends BaseComponent {
  static tagName = 'about-page';

  constructor() {
    super(template, style);
  }

  init() {
    const body = this.querySelector('#symbol-rows');
    if (body) {
      body.innerHTML = symbols
        .map(
          ([symbol, name, type]) => html`
            <tr>
              <td class="px-5 py-3 text-[var(--e-muted)]">${symbol}</td>
              <td class="px-5 py-3">${name}</td>
              <td class="px-5 py-3 font-mono text-xs text-[var(--e-accent)]">${type}</td>
            </tr>
          `
        )
        .join('');
    }
    bindInternalLinks(this);
  }
}

if (!customElements.get(AboutPage.tagName)) {
  customElements.define(AboutPage.tagName, AboutPage);
}
