import { BaseComponent } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import template from './home-page.html?raw';
import style from './home-page.css?raw';

export class HomePage extends BaseComponent {
  static tagName = 'home-page';

  constructor() {
    super(template, style);
  }

  init() {
    bindInternalLinks(this);
  }
}

if (!customElements.get(HomePage.tagName)) {
  customElements.define(HomePage.tagName, HomePage);
}
