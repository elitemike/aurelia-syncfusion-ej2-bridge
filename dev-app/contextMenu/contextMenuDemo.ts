export class ContextMenuDemo {
  // default sample: Cut/Copy/Paste with a nested Find submenu
  items = this.makeItems();
  blockOpen = false;
  beforeOpenCount = 0;
  openCount = 0;
  beforeCloseCount = 0;
  closeCount = 0;
  beforeItemRenderCount = 0;
  createdCount = 0;
  selectedText = '';
  selectCount = 0;
  showMenu = true;

  // filter sample
  filterItems = this.makeItems();
  filterSelected = '';

  // template sample
  templateItems = this.makeItems();
  itemTemplate = '<span class="cm-tpl">${text}!</span>';

  // submenu behavior sample
  clickItems = this.makeItems();
  hoverDelay = 0;
  showItemOnClick = true;

  // scrolling sample
  scrollItems = this.makeLongItems(40);

  // fields sample
  fieldItems = [
    { label: 'Alpha', subs: [{ label: 'Alpha one' }, { label: 'Alpha two' }] },
    { label: 'Beta' }
  ];
  fields = { text: 'label', children: 'subs' };
  fieldSelected = '';

  // customization sample: cssClass, sanitizer, animation
  cssClass = 'cm-custom';
  animationSettings: any = { effect: 'ZoomIn', duration: 100 };
  customItems = [{ text: 'Plain item' }, { text: 'Another item' }];
  sanitize = true;
  customTemplate = '<b>unused</b>';

  makeItems(): any[] {
    return [
      { text: 'Cut', iconCss: 'e-icons e-cut' },
      { text: 'Copy', iconCss: 'e-icons e-copy' },
      { text: 'Paste', iconCss: 'e-icons e-paste' },
      { separator: true },
      { text: 'Find', items: [{ text: 'Find...' }, { text: 'Find next' }] },
      { text: 'Select All' }
    ];
  }

  makeLongItems(count: number): any[] {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ text: `Long item ${i}` });
    }
    return items;
  }

  onBeforeOpen(event: CustomEvent) {
    this.beforeOpenCount++;
    if (this.blockOpen) {
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

  onFilterSelect(event: CustomEvent) {
    this.filterSelected = event.detail.item.text;
  }

  onFieldSelect(event: CustomEvent) {
    this.fieldSelected = event.detail.item.label;
  }

  block() { this.blockOpen = true; }
  toggle() { this.showMenu = !this.showMenu; }
  slowHover() { this.hoverDelay = 300; }
  hoverMode() { this.showItemOnClick = false; }
  restyle() { this.cssClass = 'cm-other'; }
  fade() { this.animationSettings = { effect: 'FadeIn', duration: 100 }; }
  unsanitize() { this.sanitize = false; }
  addItem() { this.items = [...this.items, { text: 'Added item' }]; }
}
