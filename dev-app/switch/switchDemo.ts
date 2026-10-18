export class SwitchDemo {
  showSwitch = true;
  checked = true;
  disabled = false;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  toggle() {
    this.showSwitch = !this.showSwitch;
  }
}
