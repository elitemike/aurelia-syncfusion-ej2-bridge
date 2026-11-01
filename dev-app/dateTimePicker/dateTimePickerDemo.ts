import { Ej2DateTimePicker } from 'widgets/dateTimePicker/ej2-dateTimePicker';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DateTimePicker)
export class DateTimePickerDemo {
  value = new Date(2024, 4, 15, 9, 30);
  min = new Date(2024, 4, 1);
  max = new Date(2024, 4, 31);
  defaultMin = new Date(1900, 0, 1);
  defaultMax = new Date(2099, 11, 31);
  minTime = new Date(2024, 4, 15, 8, 0);
  maxTime = new Date(2024, 4, 15, 12, 0);
  defaultMinTime = new Date(2024, 4, 15, 0, 0);
  defaultMaxTime = new Date(2024, 4, 15, 23, 59);
  scrollTo = new Date(2024, 4, 15, 16, 0);
  changeCount = 0;
  depthValue = new Date(2024, 4, 15, 9, 30);
  evValue: Date = null;
  events: string[] = [];
  lastChange = '';
  renderCount = 0;
  showDestroyable = true;
  destroyedCount = 0;
  alt = false;
  htmlAttrsA = { 'data-flavor': 'a' };
  htmlAttrsB = { 'data-flavor': 'b' };
  inputFormats = ['dd-MM-yyyy HH:mm'];
  multiValues = [new Date(2024, 4, 2), new Date(2024, 4, 4)];
  maskPlaceholder = { day: 'd', month: 'M', year: 'y', hour: 'h', minute: 'm' };
  keyConfigs = { altDownArrow: 'alt+downarrow', escape: 'escape' };

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = new Date(2024, 4, 20, 14, 0);
  }

  log(name: string, e?: CustomEvent) {
    this.events = [...this.events, name];
    if (name === 'change' && e && e.detail) {
      const v: Date = e.detail.value;
      this.lastChange = v ? `${v.getFullYear()}-${v.getMonth() + 1}-${v.getDate()} ${v.getHours()}:${v.getMinutes()}` : 'null';
    }
  }

  renderCell(e: CustomEvent) {
    this.renderCount++;
    if (e.detail.date.getDate() === 15) { e.detail.element.classList.add('demo-mark'); }
  }
}
