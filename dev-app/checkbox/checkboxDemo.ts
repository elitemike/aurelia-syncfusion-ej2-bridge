import { IOptionModel } from 'widgets/checkbox/ej2-checkbox-list';

export class CheckboxDemo {
  label = 'Accept terms';
  checked = false;
  disabled = false;
  showCheckbox = true;
  clickCount = 0;

  moreLabel = 'More <b class="chk-bold">options</b>';
  moreChecked = false;
  cssClass = 'chk-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  indeterminate = true;
  changeCount = 0;
  changeChecked: boolean = null;
  createdCount = 0;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeChecked = event.detail.checked;
  }

  onClick() {
    this.clickCount++;
  }

  toggle() {
    this.showCheckbox = !this.showCheckbox;
  }

  objectSource = [
    { label: 'Item 1', name: 'one' },
    { label: 'Item 2', name: 'two' },
    { label: 'Item 3', name: 'three' }
  ];
  objectSelected = [this.objectSource[1]];
  objectModel: IOptionModel = { label: 'label', name: 'name', value: 'value' };

  stringSource = ['A', 'B', 'C', 'D'];
  stringSelected: string[] = [];

  matcherSource = [
    { label: 'Item 1', name: 'one', id: 'AAA' },
    { label: 'Item 2', name: 'two', id: 'BBB' },
    { label: 'Item 3', name: 'three', id: 'CCC' }
  ];
  // a different instance with the same id, resolved through the matcher
  matcherSelected = [{ label: 'Item 2', name: 'two', id: 'BBB' }];
  matcher = (a, b) => a.id === b.id;
}
