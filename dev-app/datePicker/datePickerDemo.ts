import { Ej2DatePicker } from 'widgets/datePicker/ej2-DatePicker';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DatePicker)
export class DatePickerDemo {
  value: Date = new Date(2024, 4, 15);
  min = new Date(2024, 4, 1);
  max = new Date(2024, 4, 31);
  defaultMin = new Date(1900, 0, 1);
  defaultMax = new Date(2099, 11, 31);
  depthValue = new Date(2024, 4, 15);
  changeCount = 0;
  evValue: Date = null;
  events: string[] = [];
  lastChange = '';
  renderCount = 0;
  showDestroyable = true;
  destroyedCount = 0;
  alt = false;
  htmlAttrsA = { 'data-flavor': 'a' };
  htmlAttrsB = { 'data-flavor': 'b' };
  inputFormats = ['dd-MM-yyyy'];
  multiValues = [new Date(2024, 4, 2), new Date(2024, 4, 4)];
  maskPlaceholder = { day: 'd', month: 'M', year: 'y' };
  keyConfigs = { altDownArrow: 'alt+downarrow', escape: 'escape' };

  onChange() {
    this.changeCount++;
  }

  setDate() {
    this.value = new Date(2024, 4, 20);
  }

  log(name: string, e?: CustomEvent) {
    this.events = [...this.events, name];
    if (name === 'change' && e && e.detail) {
      const v: Date = e.detail.value;
      this.lastChange = v ? `${v.getFullYear()}-${v.getMonth() + 1}-${v.getDate()}` : 'null';
    }
  }

  renderCell(e: CustomEvent) {
    this.renderCount++;
    if (e.detail.date.getDate() === 15) { e.detail.element.classList.add('demo-mark'); }
  }
}
