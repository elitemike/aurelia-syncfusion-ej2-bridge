export class ListViewDemo {
  items = [
    { id: '1', text: 'Documents' }, { id: '2', text: 'Music' }, { id: '3', text: 'Pictures' }, { id: '4', text: 'Videos' }
  ];
  fields = { id: 'id', text: 'text' };
  selectedText = '';
  selectCount = 0;

  grouped = [
    { text: 'Apple', category: 'Fruit' }, { text: 'Banana', category: 'Fruit' }, { text: 'Carrot', category: 'Vegetable' }
  ];
  groupedFields = { text: 'text', groupBy: 'category' };

  onSelect(event: CustomEvent) {
    this.selectCount++;
    this.selectedText = event.detail.text;
  }
}
