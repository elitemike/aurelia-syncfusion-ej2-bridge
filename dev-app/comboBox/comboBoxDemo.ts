import { DataManager, Query } from '@syncfusion/ej2-data';

export class ComboBoxDemo {
  games = [
    { id: 'Game1', game: 'American Football' }, { id: 'Game2', game: 'Badminton' },
    { id: 'Game3', game: 'Basketball' }, { id: 'Game4', game: 'Cricket' }, { id: 'Game5', game: 'Football' }
  ];
  fields = { text: 'game', value: 'id' };
  value: string = 'Game2';
  enabled = true;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = 'Game5';
  }

  sports = [
    { text: 'American Football', value: 'Game1' },
    { text: 'Badminton', value: 'Game2' },
    { text: 'Basketball', value: 'Game3' },
    { text: 'Cricket', value: 'Game4' },
    { text: 'Football', value: 'Game5' },
    { text: 'Tennis', value: 'Game6' }
  ];

  sportFields = { text: 'text', value: 'value' };

  cafes = ['Café', 'Cafe latte', 'Tea'];
  ignoreAccent = true;
  ignoreCase = true;
  filterType = 'StartsWith';

  toggleIgnore() {
    this.ignoreAccent = false;
    this.ignoreCase = false;
    this.filterType = 'Contains';
  }

  dyn: any = {
    cssClass: 'dyn-one', popupHeight: '300px', popupWidth: '200px', width: '300px', zIndex: 1000, readonly: false,
    placeholder: 'First', floatLabelType: 'Never', sortOrder: 'None', allowFiltering: false, htmlAttributes: { 'data-attr': 'one' },
    fullScreen: false, allowResize: false, debounceDelay: 300, showClearButton: false
  };

  toggleDyn() {
    this.dyn = {
      cssClass: 'dyn-two', popupHeight: '150px', popupWidth: '320px', width: '250px', zIndex: 2000, readonly: true,
      placeholder: 'Second', floatLabelType: 'Always', sortOrder: 'Descending', allowFiltering: true, htmlAttributes: { 'data-attr': 'two' },
      fullScreen: true, allowResize: true, debounceDelay: 100, showClearButton: true
    };
  }

  grouped = [
    { text: 'Cricket', value: 'c', category: 'Bat' }, { text: 'Baseball', value: 'b', category: 'Bat' },
    { text: 'Tennis', value: 't', category: 'Racket' }
  ];
  groupFields = { text: 'text', value: 'text', groupBy: 'category' };
  itemTpl = '<span class="tpl-item">Item ${text}</span>';
  valueTpl = '<span class="tpl-value">Chosen ${text}</span>';
  headerTpl = '<div class="tpl-header">Header</div>';
  footerTpl = '<div class="tpl-footer">Footer</div>';
  groupTpl = '<span class="tpl-group">Group ${category}</span>';
  noRecordsTpl = '<span class="tpl-none">Nothing here</span>';
  failTpl = '<span class="tpl-fail">Failed</span>';

  objectValue: any = { text: 'Cricket', value: 'Game4' };
  query = new Query().take(2);

  many = Array.from({ length: 500 }, (_, i) => ({ text: `Item ${i}`, value: `v${i}` }));
  virtualFields = { text: 'text', value: 'value' };

  eventLog = '';
  log(name: string) {
    this.eventLog = this.eventLog ? `${this.eventLog},${name}` : name;
  }

  showLifecycle = true;
  created = 0;
  destroyed = 0;
  lifecycle(name: string) {
    if (name === 'created') { this.created++; } else { this.destroyed++; }
  }

  remote = new DataManager({ url: '/api/cb-fail' });
  failures = 0;
}
