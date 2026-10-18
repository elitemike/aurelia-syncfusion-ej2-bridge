export class TreeViewDemo {
  data = [
    {
      id: '01', name: 'Local Disk (C:)', expanded: true, subChild: [
        { id: '01-01', name: 'Program Files', subChild: [{ id: '01-01-01', name: 'Windows NT' }, { id: '01-01-02', name: 'Windows Mail' }] },
        { id: '01-02', name: 'Users', subChild: [{ id: '01-02-01', name: 'Smith' }, { id: '01-02-02', name: 'Admin' }] }
      ]
    },
    { id: '02', name: 'Local Disk (D:)', subChild: [{ id: '02-01', name: 'Personals' }, { id: '02-02', name: 'Projects' }] }
  ];
  fields = { dataSource: this.data, id: 'id', text: 'name', child: 'subChild' };

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
}
