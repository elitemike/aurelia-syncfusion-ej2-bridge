import { DataManager, Query, JsonAdaptor } from '@syncfusion/ej2-data';
import { Ej2ListView } from 'widgets/listView/ej2-listView';
import { viewResources } from 'aurelia-framework';

/** Remote style data manager without a backend, it applies the query itself or rejects the request. */
class StubAdaptor extends JsonAdaptor {
  constructor(private rows: Object[], private fail = false) {
    super();
  }

  makeRequest(request: any, deferred: any, args: any, query: Query) {
    if (this.fail) {
      deferred.reject({ error: 'stub failure' });
      return;
    }
    args.result = new DataManager(this.rows).executeLocal(query);
    deferred.resolve(args);
  }
}

@viewResources(Ej2ListView)
export class ListViewDemo {
  items = [
    { id: '1', text: 'Documents' }, { id: '2', text: 'Music' }, { id: '3', text: 'Pictures' }, { id: '4', text: 'Videos' }
  ];
  fields = { id: 'id', text: 'text' };
  selectedText = '';
  selectCount = 0;
  begin = 0;
  complete = 0;
  remoteBegin = 0;
  remoteComplete = 0;
  failures = 0;
  scrolls = 0;
  direction = '';
  isEnabled = true;
  isEnable = true;

  remoteData = new DataManager({ json: [] }, undefined, new StubAdaptor([
    { id: 'r1', text: 'Remote one' }, { id: 'r2', text: 'Remote two' }, { id: 'r3', text: 'Remote three' }
  ]));
  remoteQuery = new Query().take(2);
  failData = new DataManager({ json: [] }, undefined, new StubAdaptor([], true));

  icons = [
    { id: 'i1', text: 'Starred', icon: 'e-icons e-star-filled' },
    { id: 'i2', text: 'Plain', icon: 'e-icons e-circle-info' }
  ];
  iconFields = { id: 'id', text: 'text', iconCss: 'icon' };
  animation = { effect: 'None', duration: 0 };

  many = Array.from({ length: 200 }, (_, i) => ({ id: `m${i}`, text: `Row ${i}` }));
  manyFields = { id: 'id', text: 'text' };

  itemTemplate = '<div class="tpl-item">Item ${text}</div>';
  groupTemplate = '<div class="tpl-group">Group ${text}</div>';
  headerTemplate = '<div class="tpl-header">Custom header</div>';

  htmlItems = [{ id: 'h1', text: '<span class="rich" onclick="void 0">Rich</span>' }];

  onScroll(event: CustomEvent) {
    this.scrolls++;
    this.direction = event.detail.scrollDirection;
  }

  grouped = [
    { text: 'Apple', category: 'Fruit' }, { text: 'Banana', category: 'Fruit' }, { text: 'Carrot', category: 'Vegetable' }
  ];
  groupedFields = { text: 'text', groupBy: 'category' };

  onSelect(event: CustomEvent) {
    this.selectCount++;
    this.selectedText = event.detail.text;
  }
}
