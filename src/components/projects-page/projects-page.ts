import { BaseComponent, html } from '../../core/base-component.ts';
import { bindInternalLinks } from '../../core/internal-links.ts';
import { projects } from '../../data/projects.ts';
import template from './projects-page.html?raw';
import style from './projects-page.css?raw';

export class ProjectsPage extends BaseComponent {
  static tagName = 'projects-page';

  constructor() {
    super(template, style);
  }

  init() {
    const list = this.querySelector('#project-list');
    if (list) {
      list.innerHTML = projects.map((project) => this.card(project)).join('');
    }
    bindInternalLinks(this);
  }

  private card(project: (typeof projects)[number]): string {
    const links = [{ label: 'Repository', href: project.repo }, ...project.links];
    return html`
      <article class="rounded-xl border border-[var(--e-rule)] bg-white p-7">
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 class="text-xl font-semibold tracking-tight">${project.name}</h2>
          <span class="rounded-full bg-[var(--e-accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--e-accent)]">
            ${project.role}
          </span>
          <span class="ml-auto font-mono text-xs text-[var(--e-muted)]">${project.language}</span>
        </div>
        <p class="mt-4 leading-relaxed text-[var(--e-muted)]">${project.blurb}</p>
        <ul class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          ${links.map(
            (link) => html`
              <li>
                <a
                  href="${link.href}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[var(--e-accent)] underline-offset-2 hover:underline"
                  >${link.label} &rarr;</a
                >
              </li>
            `
          )}
        </ul>
      </article>
    `;
  }
}

if (!customElements.get(ProjectsPage.tagName)) {
  customElements.define(ProjectsPage.tagName, ProjectsPage);
}
