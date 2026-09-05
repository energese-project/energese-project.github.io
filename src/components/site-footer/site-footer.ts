import { BaseComponent } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import template from './site-footer.html?raw';
import style from './site-footer.css?raw';

export class SiteFooter extends BaseComponent {
  static tagName = 'site-footer';

  constructor() {
    super(template, style);
  }

  init() {
    bindInternalLinks(this);
  }
}

if (!customElements.get(SiteFooter.tagName)) {
  customElements.define(SiteFooter.tagName, SiteFooter);
}
