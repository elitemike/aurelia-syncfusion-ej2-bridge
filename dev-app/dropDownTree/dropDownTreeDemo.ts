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

  onChange() {
    this.changeCount++;
  }

  setSelected() {
    this.selected = ['02-01'];
  }
}
