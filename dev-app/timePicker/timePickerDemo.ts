export class TimePickerDemo {
  value = new Date(2024, 4, 15, 9, 30);
  min = new Date(2024, 4, 15, 8, 0);
  max = new Date(2024, 4, 15, 12, 0);
  defaultMin = new Date(2024, 4, 15, 0, 0);
  defaultMax = new Date(2024, 4, 15, 23, 59);
  scrollTo = new Date(2024, 4, 15, 16, 0);
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
  maskPlaceholder = { hour: 'h', minute: 'm' };
  keyConfigs = { altDownArrow: 'alt+downarrow', escape: 'escape' };

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = new Date(2024, 4, 15, 11, 0);
  }

  widenLimits() {
    this.min = new Date(2024, 4, 15, 7, 0);
    this.max = new Date(2024, 4, 15, 13, 0);
  }

  log(name: string, e?: CustomEvent) {
    this.events = [...this.events, name];
    if (name === 'change' && e && e.detail) {
      const v: Date = e.detail.value;
      this.lastChange = v ? `${v.getHours()}:${v.getMinutes()}` : 'null';
    }
  }

  renderItem(e: CustomEvent) {
    this.renderCount++;
    if (e.detail.text === '10:00') { e.detail.element.classList.add('demo-mark'); }
  }

  get display() {
    if (!this.value) { return ''; }
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(this.value.getHours())}:${p(this.value.getMinutes())}`;
  }
}
