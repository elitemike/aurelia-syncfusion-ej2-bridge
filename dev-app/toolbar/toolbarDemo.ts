export class ToolbarDemo {
  // default: Syncfusion "Default functionalities" sample
  items = [
    { text: 'Cut', tooltipText: 'Cut', prefixIcon: 'e-cut-icon' },
    { text: 'Copy', tooltipText: 'Copy', prefixIcon: 'e-copy-icon' },
    { text: 'Paste', tooltipText: 'Paste', prefixIcon: 'e-paste-icon' },
    { type: 'Separator' },
    { text: 'Bold', tooltipText: 'Bold', prefixIcon: 'e-bold-icon' },
    { text: 'Italic', tooltipText: 'Italic', prefixIcon: 'e-italic-icon' },
    { text: 'Disabled', disabled: true },
    { text: 'Right aligned', align: 'Right' }
  ];
  clickedText = '';
  clickedCount = 0;
  createdCount = 0;
  beforeCreateCount = 0;
  keyDownCount = 0;
  lastKey = '';
  showToolbar = true;
  destroyedCount = 0;

  // popup overflow
  popupItems = this.makeItems(10);
  popupWidth = '220px';
  collision = false;

  // scrollable
  scrollItems = this.makeItems(12);
  scrollStep = 40;

  // multi row and extended
  multiItems = this.makeItems(14);

  // template items and sanitizer
  templateItems = [
    { template: '<button class="e-btn tb-custom-btn" data-testid="tb-tpl-btn">Template button</button>' },
    { type: 'Separator' },
    { text: '<span class="tb-safe" onmouseover="window.__tbxss = 1">Sanitized</span>' }
  ];
  sanitize = true;

  // dynamic model
  dynamicItems = [{ text: 'One' }, { text: 'Two' }];
  dynamicWidth = '100%';
  dynamicHeight = 'auto';
  cssClass = 'tb-one';
  allowKeyboard = true;
  keyboardKeys = 0;

  makeItems(count: number) {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ text: `Item ${i}` });
    }
    return items;
  }

  onClicked(event: CustomEvent) {
    this.clickedCount++;
    this.clickedText = event.detail.item ? event.detail.item.text : '';
  }

  onCreated() {
    this.createdCount++;
  }

  onBeforeCreate() {
    this.beforeCreateCount++;
  }

  onKeyDown(event: CustomEvent) {
    this.keyDownCount++;
    this.lastKey = event.detail.originalEvent ? event.detail.originalEvent.key : '';
  }

  onDestroyed() {
    this.destroyedCount++;
  }

  toggle() {
    this.showToolbar = !this.showToolbar;
  }

  addItem() {
    this.dynamicItems = [...this.dynamicItems, { text: 'Three' }];
  }

  resize() {
    this.dynamicWidth = '320px';
    this.dynamicHeight = '80px';
  }

  restyle() {
    this.cssClass = 'tb-two';
  }

  disableKeyboard() {
    this.allowKeyboard = false;
  }

  narrow() {
    this.popupWidth = '150px';
  }

  collide() {
    this.collision = true;
  }

  stepMore() {
    this.scrollStep = 100;
  }

  unsanitize() {
    this.sanitize = false;
  }
}
