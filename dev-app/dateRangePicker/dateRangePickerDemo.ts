import { Ej2DateRangePicker } from 'widgets/dateRangePicker/ej2-dateRangePicker';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DateRangePicker)
export class DateRangePickerDemo {
  startDate = new Date(2024, 4, 10);
  endDate = new Date(2024, 4, 20);
  min = new Date(2024, 4, 1);
  max = new Date(2024, 4, 31);
  defaultMin = new Date(1900, 0, 1);
  defaultMax = new Date(2099, 11, 31);
  changeCount = 0;
  rangeValue: Date[] = [new Date(2024, 4, 6), new Date(2024, 4, 8)];
  evStart: Date = null;
  evEnd: Date = null;
  events: string[] = [];
  lastChange = '';
  renderCount = 0;
  showDestroyable = true;
  destroyedCount = 0;
  alt = false;
  htmlAttrsA = { 'data-flavor': 'a' };
  htmlAttrsB = { 'data-flavor': 'b' };
  inputFormats = ['dd-MM-yyyy'];
  keyConfigs = { altDownArrow: 'alt+downarrow', escape: 'escape' };
  presets = [
    { label: 'Next 3 days', start: new Date(2024, 4, 11), end: new Date(2024, 4, 13) },
    { label: 'Whole week', start: new Date(2024, 4, 6), end: new Date(2024, 4, 12) }
  ];

  onChange() {
    this.changeCount++;
  }

  setRange() {
    this.startDate = new Date(2024, 4, 1);
    this.endDate = new Date(2024, 4, 3);
  }

  setValue() {
    this.rangeValue = [new Date(2024, 5, 3), new Date(2024, 5, 5)];
  }

  get rangeText() {
    return (this.rangeValue || []).map(d => d ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : 'null').join(' / ');
  }

  log(name: string, e?: CustomEvent) {
    this.events = [...this.events, name];
    if (name === 'change' && e && e.detail) {
      const s: Date = e.detail.startDate;
      const en: Date = e.detail.endDate;
      this.lastChange = s ? `${s.getMonth() + 1}/${s.getDate()}-${en.getMonth() + 1}/${en.getDate()}` : 'null';
    }
  }

  renderCell(e: CustomEvent) {
    this.renderCount++;
    if (e.detail.date.getDate() === 15) { e.detail.element.classList.add('demo-mark'); }
  }
}
