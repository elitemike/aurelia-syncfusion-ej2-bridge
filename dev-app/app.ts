import { observable } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { demoRoutes, DemoRoute } from './nav';

export class App {
  private categories: { name: string; routes: DemoRoute[] }[] = [];
  visibleCategories: { name: string; routes: DemoRoute[] }[] = [];
  @observable filter = '';

  constructor() {
    demoRoutes.forEach(r => {
      let cat = this.categories.find(c => c.name === r.category);
      if (!cat) { cat = { name: r.category, routes: [] }; this.categories.push(cat); }
      cat.routes.push(r);
    });
    this.filterChanged();
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
