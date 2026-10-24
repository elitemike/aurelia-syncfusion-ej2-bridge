import { DataManager } from '@syncfusion/ej2-data';

function disks() {
  return [
    {
      id: '01', name: 'Local Disk (C:)', expanded: true, subChild: [
        { id: '01-01', name: 'Program Files', subChild: [{ id: '01-01-01', name: 'Windows NT' }, { id: '01-01-02', name: 'Windows Mail' }] },
        { id: '01-02', name: 'Users', subChild: [{ id: '01-02-01', name: 'Smith' }, { id: '01-02-02', name: 'Admin' }] }
      ]
    },
    { id: '02', name: 'Local Disk (D:)', subChild: [{ id: '02-01', name: 'Personals' }, { id: '02-02', name: 'Projects' }] }
  ];
}

function fieldsFor(data: any[]) {
  return { dataSource: data, id: 'id', text: 'name', child: 'subChild' };
}

export class TreeViewDemo {
  data = disks();
  fields = fieldsFor(this.data);

  selected: string[] = ['01-02'];
  checked: string[] = ['02-01'];
  expanded: string[] = ['01'];
  selectedEvents = 0;
  lastSelected = '';

  onNodeSelected(event: CustomEvent) {
    this.selectedEvents++;
    this.lastSelected = event.detail.nodeData.text;
  }

  selectProgramFiles() {
    this.selected = ['01-01'];
  }

  setChecked() {
    this.checked = ['01-01', '01-02'];
  }

  collapseAll() {
    this.expanded = [];
  }

  // events log
  ev: { [key: string]: string } = { tree: '', edit: '', drag: '', remote: '', data: '' };
  eventFields = fieldsFor(disks());
  rec(section: string, name: string) {
    this.ev[section] = `${this.ev[section]}${name},`;
  }

  // check box behaviour
  checkFields = fieldsFor(disks());
  autoCheck = false;
  checkOnClick = true;
  checkDisabledChildren = false;
  checkedBehaviour: string[] = [];
  enableAutoCheck() {
    this.autoCheck = true;
  }

  // expansion behaviour
  expandFields = fieldsFor(disks());
  expandOn = 'Click';
  loadOnDemand = false;
  animation = { expand: { effect: 'None', duration: 0 }, collapse: { effect: 'None', duration: 0 } };

  // sorting / multi selection
  sortOrder = 'Descending';

  // appearance
  appearanceFields = fieldsFor(disks());
  cssClass = 'tv-custom-class';
  height = '160px';
  fullRowSelect = false;
  fullRowNavigable = true;
  allowTextWrap = true;
  disabled = false;
  nodeTemplate = '<span class="tpl-node">Node: ${name}</span>';
  templateFields = fieldsFor(disks());
  htmlFields = fieldsFor([{ id: 'h1', name: '<b class="bold-node">Bold</b>' }]);
  restyle() {
    this.cssClass = 'tv-other-class';
    this.height = '200px';
    this.disabled = true;
  }

  // editing
  editFields = fieldsFor(disks());
  allowEditing = true;

  // drag and drop
  dragFields = fieldsFor(disks());
  allowDragAndDrop = true;
  dragArea = '#tv-drag-area';

  // virtualization
  bigData = Array.from({ length: 500 }, (_v, i) => ({ id: `n${i}`, name: `Node ${i}` }));
  bigFields = { dataSource: this.bigData, id: 'id', text: 'name' };

  // remote failure
  remoteFields = { dataSource: new DataManager({ url: 'data:text/plain,not-json' }), id: 'id', text: 'name', child: 'subChild' };

  // data source
  dataSourceFields = fieldsFor(disks());

  // destroy
  showDestroy = true;
  destroyedCount = 0;
  destroyFields = fieldsFor(disks());
  onDestroyed() {
    this.destroyedCount++;
  }
}
