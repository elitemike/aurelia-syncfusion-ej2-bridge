import { DataManager, Query } from '@syncfusion/ej2-data';

export class ListBoxDemo {
  sports = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Tennis'];
  value: string[] = ['Football'];
  changeCount = 0;
  selectCount = 0;
  createdCount = 0;
  dataBoundCount = 0;
  itemRenderCount = 0;
  actionBegin = 0;
  actionComplete = 0;

  checkSettings: any = { mode: 'Multiple', showCheckbox: true, showSelectAll: true, checkboxPosition: 'Left' };
  maxSelection = 3;
  cssClass = 'lb-custom';
  enabled = true;

  cafes = ['Café', 'Cafe latte', 'Tea', 'Cappuccino', 'Espresso'];
  filterType = 'StartsWith';
  ignoreCase = true;
  ignoreAccent = true;
  sortOrder = 'Ascending';
  filterCount = 0;

  // drag and drop needs object data, a plain string array has no `value` field to identify the dragged item
  left = ['Apple', 'Banana', 'Cherry', 'Date'].map(text => ({ text, value: text }));
  right = ['Elderberry', 'Fig'].map(text => ({ text, value: text }));
  toolbar: any = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'], position: 'Right' };
  dragStart = 0;
  drags = 0;
  beforeDrops = 0;
  drops = 0;
  cancelDrop = false;

  grouped = [
    { text: 'Cricket', value: 'c', category: 'Bat' }, { text: 'Baseball', value: 'b', category: 'Bat' },
    { text: 'Tennis', value: 't', category: 'Racket' }, { text: 'Badminton', value: 'm', category: 'Racket' }
  ];
  groupFields = { text: 'text', value: 'value', groupBy: 'category' };
  itemTpl = '<span class="lb-item-tpl">Sport ${text}</span>';
  groupTpl = '<span class="lb-group-tpl">Group ${category}</span>';
  noRecordsTpl = '<span class="lb-none-tpl">Nothing here</span>';
  failTpl = '<span class="lb-fail-tpl">Failed</span>';
  empty: string[] = [];

  fields = { text: 'text', value: 'value' };
  manager = new DataManager([
    { text: 'One', value: '1' }, { text: 'Two', value: '2' }, { text: 'Three', value: '3' },
    { text: 'Four', value: '4' }, { text: 'Five', value: '5' }
  ]);
  query = new Query().take(3);
  remote = new DataManager({ url: '/api/lb-fail' });
  failSource: any = [{ text: 'Local one', value: 'l1' }, { text: 'Local two', value: 'l2' }];
  failures = 0;
  destroyedCount = 0;
  showFail = true;

  onChange(event: CustomEvent) {
    this.changeCount++;
  }

  onBeforeDrop(event: CustomEvent) {
    this.beforeDrops++;
    if (this.cancelDrop) {
      event.detail.cancel = true;
    }
  }

  changeCheck() {
    this.checkSettings = { mode: 'Single', showCheckbox: false, showSelectAll: false, checkboxPosition: 'Right' };
    this.maxSelection = 1;
    this.cssClass = 'lb-custom-two';
  }

  changeFilter() {
    this.filterType = 'Contains';
    this.ignoreCase = false;
    this.ignoreAccent = false;
    this.sortOrder = 'Descending';
  }
}
