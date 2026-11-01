import { DataManager, Query } from '@syncfusion/ej2-data';
import { Ej2MultiColumnComboBox } from 'widgets/multiColumnComboBox/ej2-multiColumnComboBox';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2MultiColumnComboBox)
export class MultiColumnComboBoxDemo {
  employees = [
    { EmployeeID: 1, Name: 'Andrew Fuller', Designation: 'Team Lead', Country: 'England' },
    { EmployeeID: 2, Name: 'Anne Dodsworth', Designation: 'Developer', Country: 'USA' },
    { EmployeeID: 3, Name: 'Janet Leverling', Designation: 'HR', Country: 'USA' },
    { EmployeeID: 4, Name: 'Laura Callahan', Designation: 'Product Manager', Country: 'USA' },
    { EmployeeID: 5, Name: 'Margaret Peacock', Designation: 'Developer', Country: 'USA' },
    { EmployeeID: 6, Name: 'Tom Hardy', Designation: 'Developer', Country: 'England' }
  ];
  fields = { text: 'Name', value: 'EmployeeID' };
  groupFields = { text: 'Name', value: 'EmployeeID', groupBy: 'Country' };
  columns = [
    { field: 'Name', header: 'Name', width: 140 },
    { field: 'Designation', header: 'Designation', width: 130 },
    { field: 'Country', header: 'Country', width: 90 }
  ];

  value: any = 2;
  text: string = null;
  index: number = null;
  counts: any = { created: 0, open: 0, close: 0, actionBegin: 0, actionComplete: 0, filtering: 0, change: 0 };
  selected = '';
  interacted: boolean = null;
  cancelSelect = false;

  o: any = {
    filterType: 'StartsWith', allowSorting: false, sortOrder: 'None', sortType: 'OneColumn', showClear: false,
    floatLabelType: 'Never', cssClass: 'mc-custom', width: '300px', popupWidth: '400px', popupHeight: '200px'
  };

  gridSettings: any = { enableAltRow: true, rowHeight: 40, gridLines: 'Both', allowTextWrap: false, allowResizing: false };
  many = Array.from({ length: 500 }, (_, i) => ({ EmployeeID: i + 1, Name: `Person ${i + 1}`, Designation: 'Staff', Country: 'USA' }));

  itemTpl = '<tr class="mc-item-tpl"><td>${Name}</td><td>${Designation}</td><td>${Country}</td></tr>';
  footerTpl = '<div class="mc-footer-tpl">Total rows</div>';
  groupTpl = '<span class="mc-group-tpl">Country ${Country}</span>';
  noRecordsTpl = '<span class="mc-none-tpl">No employees</span>';
  failTpl = '<span class="mc-fail-tpl">Failed to load</span>';

  disabled = true;
  readonly = true;
  htmlAttrs = { 'data-foo': 'bar' };
  query = new Query().take(3);

  failSource: any = this.employees.slice(0, 2);
  remote = new DataManager({ url: '/api/mc-fail' });
  failures = 0;

  count(name: string) {
    this.counts[name]++;
  }

  onSelect(event: CustomEvent) {
    const data = event.detail.itemData;
    this.selected = data && (data.text || data.Name);
    if (this.cancelSelect) {
      event.detail.cancel = true;
    }
  }

  onChange(event: CustomEvent) {
    this.counts.change++;
    this.interacted = event.detail.isInteracted;
  }

  changeOptions() {
    this.o = {
      filterType: 'Contains', allowSorting: true, sortOrder: 'Descending', sortType: 'MultipleColumns', showClear: true,
      floatLabelType: 'Always', cssClass: 'mc-custom-two', width: '350px', popupWidth: '500px', popupHeight: '150px'
    };
  }

  enable() {
    this.disabled = false;
    this.readonly = false;
    this.htmlAttrs = { 'data-foo': 'baz' };
  }

  changeGrid() {
    this.gridSettings = { enableAltRow: false, rowHeight: 30, gridLines: 'None', allowTextWrap: true, allowResizing: true };
  }
}
