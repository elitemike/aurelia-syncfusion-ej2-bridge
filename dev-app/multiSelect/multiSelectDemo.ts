import { Query, DataManager } from '@syncfusion/ej2-data';

export class MultiSelectDemo {
  sports = [
    { id: 'Game1', game: 'American Football' }, { id: 'Game2', game: 'Badminton' }, { id: 'Game3', game: 'Basketball' },
    { id: 'Game4', game: 'Cricket' }, { id: 'Game5', game: 'Football' }, { id: 'Game6', game: 'Golf' }
  ];
  fields = { text: 'game', value: 'id' };
  grouped = [
    { id: 'a1', name: 'Apple', kind: 'Fruit' }, { id: 'a2', name: 'Banana', kind: 'Fruit' },
    { id: 'a3', name: 'Carrot', kind: 'Vegetable' }, { id: 'a4', name: 'Leek', kind: 'Vegetable' }
  ];
  groupFields = { text: 'name', value: 'id', groupBy: 'kind' };
  values: string[] = ['Game2', 'Game4'];
  changeCount = 0;
  ev: { [key: string]: string } = {
    value: '', checkbox: '', custom: '', life: '', filter: '', resize: '', data: '', count: '', remote: ''
  };
  selectDetail = '';

  rec(section: string, name: string, event?: CustomEvent) {
    this.ev[section] = `${this.ev[section]}${name},`;
    if (name === 'select' && event && event.detail && event.detail.itemData) {
      this.selectDetail = event.detail.itemData.game;
    }
  }

  onChange() {
    this.changeCount++;
  }

  setValues() {
    this.values = ['Game1'];
  }

  // appearance / behaviour
  cssClass = 'ms-custom-class';
  width = '320px';
  popupHeight = '150px';
  popupWidth = '260px';
  placeholder = 'Pick sports';
  floatLabelType = 'Always';
  showClearButton = true;
  showDropDownIcon = true;
  htmlAttributes = { 'data-extra': 'hello', title: 'multi title' };
  locale = 'en-US';
  zIndex = 4321;
  closePopupOnSelect = false;
  hideSelectedItem = false;
  enableSelectionOrder = true;
  sortOrder = 'Descending';
  openOnClick = true;
  enableHtmlSanitizer = true;
  appValues: string[] = ['Game1'];

  restyle() {
    this.cssClass = 'ms-other-class';
    this.width = '400px';
    this.placeholder = 'Changed placeholder';
    this.popupHeight = '200px';
    this.popupWidth = '300px';
    this.zIndex = 5555;
    this.sortOrder = 'Ascending';
    this.showClearButton = false;
    this.showDropDownIcon = false;
    this.htmlAttributes = { 'data-extra': 'changed', title: 'changed title' };
    this.floatLabelType = 'Never';
  }

  // delimiter mode
  delimiterChar = ';';
  delimText = "Basketball";
  delimValues: string[] = ['Game1', 'Game3'];
  changeDelimiter() {
    this.delimiterChar = '|';
  }

  // state
  enabled = true;
  readonly = false;
  toggleState() {
    this.enabled = !this.enabled;
    this.readonly = !this.readonly;
  }

  // filtering
  filterType = 'Contains';
  filterBarPlaceholder = 'Search here';
  ignoreCase = true;
  ignoreAccent = true;
  debounceDelay = 0;
  isDeviceFullScreen = false;
  accents = [{ id: 'c1', name: 'Café' }, { id: 'c2', name: 'Cafe Latte' }, { id: 'c3', name: 'Tea' }];
  accentFields = { text: 'name', value: 'id' };

  // query
  query = new Query().take(3);

  // check box specific
  selectAllText = 'Pick everything';
  unSelectAllText = 'Pick nothing';
  summaryTagCount = 2;
  summaryTagTemplate = '${selectedCount} chosen';
  summaryValues: string[] = [];
  addToSummary() {
    this.summaryValues = ['Game1', 'Game2', 'Game3'];
  }

  // object binding
  objValues: any[] = [{ id: 'Game2', game: 'Badminton' }];
  objValueOut() {
    return this.objValues.map(v => (typeof v === 'object' ? v.game : v)).join(',');
  }

  // templates
  itemTemplate = '<span class="tpl-item">Item: ${game}</span>';
  valueTemplate = '<span class="tpl-value">Value: ${game}</span>';
  headerTemplate = '<div class="tpl-header">The header</div>';
  footerTemplate = '<div class="tpl-footer">The footer</div>';
  groupTemplate = '<span class="tpl-group">Group: ${kind}</span>';
  noRecordsTemplate = '<span class="tpl-norecords">Nothing found</span>';
  actionFailureTemplate = '<span class="tpl-failure">Data failed</span>';
  tplValues: string[] = ['Game1'];
  noData: any[] = [];
  remote = new DataManager({ url: 'data:text/plain,not-json' });
  bigData = Array.from({ length: 300 }, (_v, i) => ({ id: `n${i}`, name: `Item ${i}` }));
  bigFields = { text: 'name', value: 'id' };

  // destroy
  showDestroy = true;
  destroyedCount = 0;
  onDestroyed() {
    this.destroyedCount++;
  }
}
