import { observable } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { demoRoutes, DemoRoute } from './nav';

export class App {
  private categories: { name: string; routes: DemoRoute[] }[] = [];
  visibleCategories: { name: string; routes: DemoRoute[] }[] = [];
  @observable filter = '';
  // no initializer: the change callback would fire for it and overwrite the stored choice before it is read
  @observable theme: string;
  // keep in sync with scripts/themes (tools/copy-themes.js); e2e/themes.spec.ts checks it
  themes: string[] = [
    'bds', 'bds-dark', 'bootstrap', 'bootstrap-dark', 'bootstrap4', 'bootstrap5', 'bootstrap5-dark', 'bootstrap5.3', 'bootstrap5.3-dark', 'fabric', 'fabric-dark', 'fluent', 'fluent-dark', 'fluent2', 'fluent2-dark', 'fluent2-highcontrast', 'highcontrast', 'material', 'material-dark', 'material3', 'material3-dark', 'tailwind', 'tailwind-dark', 'tailwind3', 'tailwind3-dark'
  ];

  constructor() {
    let stored: string | null = null;
    try { stored = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
    this.theme = stored && this.themes.indexOf(stored) >= 0 ? stored : 'material3';

    demoRoutes.forEach(r => {
      let cat = this.categories.find(c => c.name === r.category);
      if (!cat) { cat = { name: r.category, routes: [] }; this.categories.push(cat); }
      cat.routes.push(r);
    });
    this.filterChanged();
  }

  themeChanged() {
    if (!this.theme) { return; }
    const link = document.getElementById('theme-link') as HTMLLinkElement;
    if (link) { link.href = `scripts/themes/${this.theme}.css`; }
    document.body.classList.toggle('theme-dark', /dark|highcontrast/.test(this.theme));
    try { localStorage.setItem('theme', this.theme); } catch (e) { /* storage unavailable */ }
  }

  filterChanged() {
    const term = this.filter.trim().toLowerCase();
    this.visibleCategories = this.categories
      .map(c => ({ name: c.name, routes: c.routes.filter(r => !term || r.title.toLowerCase().includes(term)) }))
      .filter(c => c.routes.length > 0);
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.options.root = '/';
    config.options.pushState = true;
    config.map([
      { route: '', redirect: 'home' },
      { route: 'home', name: 'home', moduleId: PLATFORM.moduleName('home'), title: 'Home' },
      ...demoRoutes.map(r => ({ route: r.route, name: r.route, moduleId: r.moduleId, title: r.title }))
    ]);
  }
}
