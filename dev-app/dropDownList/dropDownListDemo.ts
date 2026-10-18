import { DropDownListModel } from '@syncfusion/ej2-dropdowns';

export class DropDownListDemo {
  sports = [
    { text: 'American Football', value: 'Game1' },
    { text: 'Badminton', value: 'Game2' },
    { text: 'Basketball', value: 'Game3' },
    { text: 'Cricket', value: 'Game4' },
    { text: 'Football', value: 'Game5' },
    { text: 'Tennis', value: 'Game6' }
  ];

  model: DropDownListModel = {
    fields: { text: 'text', value: 'value' },
    placeholder: 'Select a sport',
    dataSource: this.sports
  };

  fields = { text: 'text', value: 'value' };
  value: string = 'Game3';
  changeCount = 0;
  lastChange = '';
  enabled = true;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.lastChange = event.detail.value;
  }

  setValue(v: string) {
    this.value = v;
  }
}
