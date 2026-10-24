export class MenuDemo {
  // default sample: horizontal menu with submenus
  items = this.makeItems();
  beforeOpenCount = 0;
  openCount = 0;
  beforeCloseCount = 0;
  closeCount = 0;
  beforeItemRenderCount = 0;
  createdCount = 0;
  selectedText = '';
  selectCount = 0;
  blockOpen = false;
  showMenu = true;

  // vertical sample
  verticalItems = this.makeItems();

  // hamburger sample
  hamburgerItems = this.makeItems();
  targetItems = this.makeItems();
  sanitizeItems = this.makeItems();
  unsafeItems = this.makeItems();
  title = 'Navigation <span class="m-evil" onmouseover="window.__mxss = 1">menu</span>';
  sanitize = true;
  hamburgerTitle = 'Navigation';

  // template sample
  templateItems = this.makeItems();
  template = '<span class="m-tpl">${text}!</span>';

  // submenu behavior
  clickItems = this.makeItems();
  showItemOnClick = true;
  hoverDelay = 0;

  // scrolling sample
  scrollItems = this.makeLongItems(14);

  // data binding sample: flat data with parent links
  flatItems: any[] = [
    { id: 'home', name: 'Home' },
    { id: 'products', name: 'Products' },
    { id: 'phones', name: 'Phones', pid: 'products' },
    { id: 'tablets', name: 'Tablets', pid: 'products' },
    { id: 'about', name: 'About' }
  ];
  fields = { itemId: 'id', parentId: 'pid', text: 'name' };

  // customization: cssClass, animation, filter
  cssClass = 'm-custom';
  animationSettings: any = { effect: 'FadeIn', duration: 100 };
  customItems = [
    { text: 'Docs', iconCss: 'e-icons e-description', items: [{ text: 'Guide' }, { text: 'API', url: '#m-api' }] },
    { separator: true },
    { text: 'Contact' }
  ];
  filter = 'm-row';

  makeItems(): any[] {
    return [
      { text: 'File', items: [{ text: 'New' }, { text: 'Open' }, { separator: true }, { text: 'Save' }] },
      { text: 'Edit', items: [{ text: 'Cut', iconCss: 'e-icons e-cut' }, { text: 'Copy' }, { text: 'Paste' }] },
      { text: 'View', items: [{ text: 'Zoom', items: [{ text: 'Zoom in' }, { text: 'Zoom out' }] }] },
      { text: 'Help' }
    ];
  }

  makeLongItems(count: number): any[] {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ text: `Entry ${i}` });
    }
    return items;
  }

  onBeforeOpen(event: CustomEvent) {
    this.beforeOpenCount++;
    if (this.blockOpen && event.detail.parentItem && event.detail.parentItem.text === 'Edit') {
      event.detail.cancel = true;
    }
  }

  onOpen() { this.openCount++; }
  onBeforeClose() { this.beforeCloseCount++; }
  onClose() { this.closeCount++; }
  onBeforeItemRender() { this.beforeItemRenderCount++; }
  onCreated() { this.createdCount++; }

  onSelect(event: CustomEvent) {
    this.selectCount++;
    this.selectedText = event.detail.item.text;
  }

  block() { this.blockOpen = true; }
  toggle() { this.showMenu = !this.showMenu; }
  addItem() { this.items = [...this.items, { text: 'Extra' }]; }
  hoverMode() { this.showItemOnClick = false; }
  slowHover() { this.hoverDelay = 300; }
  restyle() { this.cssClass = 'm-other'; }
  retitle() { this.hamburgerTitle = 'Renamed'; }
  unsanitize() { this.sanitize = false; }
  refade() { this.animationSettings = { effect: 'SlideDown', duration: 100 }; }
}
