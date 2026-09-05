import { BaseComponent } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import template from './site-nav.html?raw';
import style from './site-nav.css?raw';

export class SiteNav extends BaseComponent {
  static tagName = 'site-nav';

  constructor() {
    super(template, style);
  }

  init() {
    bindInternalLinks(this);

    window.addEventListener('route-changed', () => this.markCurrent());
    this.markCurrent();
  }

  private markCurrent() {
    const path = window.location.pathname;
    this.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => {
      if (link.dataset.route === path) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

if (!customElements.get(SiteNav.tagName)) {
  customElements.define(SiteNav.tagName, SiteNav);
}
