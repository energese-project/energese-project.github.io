import { BaseComponent } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import template from './research-page.html?raw';
import style from './research-page.css?raw';

export class ResearchPage extends BaseComponent {
  static tagName = 'research-page';

  constructor() {
    super(template, style);
  }

  init() {
    bindInternalLinks(this);
  }
}

if (!customElements.get(ResearchPage.tagName)) {
  customElements.define(ResearchPage.tagName, ResearchPage);
}
