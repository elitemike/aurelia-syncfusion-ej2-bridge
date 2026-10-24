export class SwitchDemo {
  showSwitch = true;
  checked = true;
  disabled = false;
  changeCount = 0;

  inputValue = 'on';
  cssClass = 'sw-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  moreChecked = false;
  blockChange = false;
  beforeCount = 0;
  createdCount = 0;

  onBeforeChange(event: CustomEvent) {
    this.beforeCount++;
    if (this.blockChange) {
      event.detail.cancel = true;
    }
  }

  onChange() {
    this.changeCount++;
  }

  toggle() {
    this.showSwitch = !this.showSwitch;
  }
}
