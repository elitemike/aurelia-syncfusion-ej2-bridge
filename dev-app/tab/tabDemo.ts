export class TabDemo {
  // default sample with two-way selectedItem
  items = this.makeItems();
  selectedIndex = 1;
  selectingCount = 0;
  selectedCount = 0;
  createdCount = 0;
  lastSelecting = -1;
  showTab = true;
  destroyedCount = 0;
  blockSelect = false;

  // placement and sizing
  placement = 'Top';
  heightMode = 'Auto';
  placementItems = this.makeItems();
  cssClass = 'tab-one';
  width = '100%';
  height = 'auto';

  // overflow
  overflowItems = this.makeLongItems(10);
  overflowMode = 'Scrollable';
  scrollStep = 40;
  popupItems = this.makeLongItems(10);
  multiRowItems = this.makeLongItems(10);
  extendedItems = this.makeLongItems(10);

  // closable, add and remove
  closableItems = this.makeItems();
  addingCount = 0;
  addedCount = 0;
  removingCount = 0;
  removedCount = 0;
  removedHeader = '';
  blockRemove = false;
  closableTab: any;
  reorderItems = this.makeLongItems(8);
  reorderActive = false;
  extraCounter = 0;

  // load on demand
  demandItems = this.makeItems();
  initItems = this.makeItems();
  loadOn = 'Demand';
  clearTemplates = true;

  // drag and drop
  dragItems = this.makeItems();
  dragStartCount = 0;
  draggingCount = 0;
  draggedCount = 0;
  dragArea = '#tab-drag-area';

  // sanitizer, animation, swipe
  safeItems = this.makeSafeItems();
  unsafeItems = this.makeSafeItems();
  sanitize = true;
  animation: any = { previous: { effect: 'None', duration: 0 }, next: { effect: 'None', duration: 0 } };
  swipeMode = 'Touch';

  makeSafeItems(): any[] {
    return [
      { header: { text: 'Safe' }, content: '<span class="tab-safe" onmouseover="window.__tabxss = 1">Safe content</span>' },
      { header: { text: 'Other' }, content: 'Other content' }
    ];
  }

  makeItems(): any[] {
    return [
      { header: { text: 'Twitter' }, content: 'Twitter content' },
      { header: { text: 'Facebook' }, content: 'Facebook content' },
      { header: { text: 'WhatsApp' }, content: 'WhatsApp content' },
      { header: { text: 'Telegram' }, content: 'Telegram content' }
    ];
  }

  makeLongItems(count: number): any[] {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ header: { text: `Tab number ${i}` }, content: `Content ${i}` });
    }
    return items;
  }

  onSelecting(event: CustomEvent) {
    this.selectingCount++;
    this.lastSelecting = event.detail.selectingIndex;
    if (this.blockSelect && event.detail.selectingIndex === 3) {
      event.detail.cancel = true;
    }
  }

  onSelected() { this.selectedCount++; }
  onCreated() { this.createdCount++; }
  onDestroyed() { this.destroyedCount++; }
  onAdding() { this.addingCount++; }
  onAdded() { this.addedCount++; }

  onRemoving(event: CustomEvent) {
    this.removingCount++;
    if (this.blockRemove) {
      event.detail.cancel = true;
    }
  }

  onRemoved(event: CustomEvent) {
    this.removedCount++;
    this.removedHeader = event.detail.removedItem ? event.detail.removedItem.textContent.trim() : '';
  }

  onDragStart() { this.dragStartCount++; }
  onDragging() { this.draggingCount++; }
  onDragged() { this.draggedCount++; }

  select(index: number) { this.selectedIndex = index; }
  toggle() { this.showTab = !this.showTab; }
  block() { this.blockSelect = true; }
  blockRemoval() { this.blockRemove = true; }
  bottom() { this.placement = 'Bottom'; }
  fill() { this.heightMode = 'Fill'; }
  restyle() { this.cssClass = 'tab-two'; }
  resize() { this.width = '320px'; this.height = '180px'; }
  addTab() {
    this.extraCounter++;
    this.closableTab.widget.addTab([{ header: { text: `Added ${this.extraCounter}` }, content: `Added content ${this.extraCounter}` }], 1);
  }
  removeTab() { this.closableTab.widget.removeTab(0); }
  reorder() { this.reorderActive = true; }
  step() { this.scrollStep = 100; }
  unsanitize() { this.sanitize = false; }
  demandMode() { this.loadOn = 'Init'; }
  keepTemplates() { this.clearTemplates = false; }
  swipe() { this.swipeMode = 'Mouse'; }
}
