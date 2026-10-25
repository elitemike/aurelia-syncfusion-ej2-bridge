export class BreadcrumbDemo {
  items = this.makeItems();
  activeItem = 'http://bc.example.test/crumb';
  cancelNavigation = true;
  clickedText = '';
  clickCount = 0;
  renderCount = 0;
  createdCount = 0;
  activeNavigation = false;

  // overflow
  overflowItems = this.makeItems(8);
  maxItems = 3;
  overflowMode = 'Collapsed';

  // templates
  templateItems = this.makeItems();
  itemTemplate = '<span class="bc-tpl">${text}</span>';
  separatorTemplate = '<span class="bc-sep">&gt;</span>';

  // url generated items
  url = '/bc/alpha/beta/gamma';

  // navigation, disabled, css
  navItems = [{ text: 'Home', url: 'http://bc.example.test/nav-target' }, { text: 'Page', url: 'http://bc.example.test/active' }];
  enableNavigation = false;
  disabled = false;
  cssClass = 'bc-one';

  makeItems(count = 4): any[] {
    if (count === 4) {
      return [
        { text: 'Home', iconCss: 'e-icons e-home', url: 'http://bc.example.test/home' },
        { text: 'Components', url: 'http://bc.example.test/components' },
        { text: 'Navigation', url: 'http://bc.example.test/nav' },
        { text: 'Breadcrumb', url: 'http://bc.example.test/crumb' }
      ];
    }
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ text: `Level ${i}`, url: `http://bc.example.test/level${i}` });
    }
    return items;
  }

  onItemClick(event: CustomEvent) {
    this.clickCount++;
    this.clickedText = event.detail.item.text;
    if (this.cancelNavigation) {
      event.detail.event.preventDefault();
    }
  }

  onBeforeItemRender() { this.renderCount++; }
  onCreated() { this.createdCount++; }

  activateNav() { this.activeItem = 'http://bc.example.test/nav'; }
  allowActive() { this.activeNavigation = true; }
  collapse() { this.overflowMode = 'Default'; this.maxItems = 4; }
  changeUrl() { this.url = '/bc/one/two'; }
  navigate() { this.enableNavigation = true; }
  disable() { this.disabled = true; }
  restyle() { this.cssClass = 'bc-two'; }
}
