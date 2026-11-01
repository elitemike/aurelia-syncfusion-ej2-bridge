import { DataManager } from '@syncfusion/ej2-data';
import { Ej2DropDownTree } from 'widgets/dropDownTree/ej2-dropDownTree';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2DropDownTree)
export class DropDownTreeDemo {
  data = [
    { id: '01', name: 'Music', children: [{ id: '01-01', name: 'Gouttes.mp3' }] },
    { id: '02', name: 'Videos', expanded: true, children: [{ id: '02-01', name: 'Naturals.mp4' }, { id: '02-02', name: 'Wild.mpeg' }] },
    {
      id: '03', name: 'Documents', children: [
        { id: '03-01', name: 'Pollution.docx' }, { id: '03-02', name: 'Warming.ppt' }, { id: '03-03', name: 'Network.pdf' }
      ]
    }
  ];
  fields = { dataSource: this.data, value: 'id', text: 'name', child: 'children' };
  selected: string[] = ['03-02'];
  selectedText = '';
  changeCount = 0;

  ev: { [key: string]: string } = { life: '', filter: '', remote: '', select: '' };
  rec(section: string, name: string) {
    this.ev[section] = `${this.ev[section]}${name},`;
  }

  onChange() {
    this.changeCount++;
  }

  setSelected() {
    this.selected = ['02-01'];
  }

  // checkbox section
  selectAllText = 'Tick all';
  unSelectAllText = 'Untick all';
  treeSettings = { autoCheck: true, expandOn: 'Click', loadOnDemand: false };
  checkValues: string[] = [];

  // multi selection / delimiter
  delimiterChar = ' | ';
  multiValues: string[] = ['02-01', '02-02'];
  wrapText = true;
  changeOnBlur = false;

  // filter
  filterType = 'Contains';
  filterBarPlaceholder = 'Find a file';
  ignoreCase = true;
  ignoreAccent = true;
  noRecordsTemplate = '<span class="tpl-norecords">No files match</span>';

  // appearance
  cssClass = 'ddt-custom-class';
  width = '320px';
  popupHeight = '180px';
  popupWidth = '280px';
  placeholder = 'Pick a file';
  floatLabelType = 'Always';
  showClearButton = true;
  showDropDownIcon = true;
  htmlAttributes = { 'data-extra': 'hello' };
  zIndex = 4321;
  sortOrder = 'Descending';
  enabled = true;
  readonly = false;
  appValue: string[] = ['02-01'];
  restyle() {
    this.cssClass = 'ddt-other-class';
    this.width = '400px';
    this.placeholder = 'Changed placeholder';
    this.popupHeight = '220px';
    this.popupWidth = '320px';
    this.zIndex = 5555;
    this.sortOrder = 'Ascending';
    this.showClearButton = false;
    this.showDropDownIcon = false;
    this.floatLabelType = 'Never';
    this.htmlAttributes = { 'data-extra': 'changed' };
    this.enabled = false;
    this.readonly = true;
  }

  // templates
  itemTemplate = '<span class="tpl-item">Node: ${name}</span>';
  valueTemplate = '<span class="tpl-value">Chosen: ${name}</span>';
  headerTemplate = '<div class="tpl-header">The header</div>';
  footerTemplate = '<div class="tpl-footer">The footer</div>';
  customTemplate = '<span class="tpl-custom">Custom: ${text}</span>';
  tplValue: string[] = ['02-01'];
  sanitizedData = [{ id: 'h1', name: '<b class="bold-node">Bold</b>' }];
  sanitizedFields = { dataSource: this.sanitizedData, value: 'id', text: 'name' };

  // remote failure
  actionFailureTemplate = '<span class="tpl-failure">Tree failed</span>';
  remoteFields = { dataSource: new DataManager({ url: 'data:text/plain,not-json' }), value: 'id', text: 'name', child: 'children' };

  // destroy
  showDestroy = true;
  destroyedCount = 0;
  onDestroyed() {
    this.destroyedCount++;
  }
}
