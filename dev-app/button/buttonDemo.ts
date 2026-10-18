export class ButtonDemo {
  showButton = true;
  disabled = false;
  isPrimary = false;
  isToggle = false;
  clickCount = 0;

  onClick() {
    this.clickCount++;
  }

  toggleLifecycle() {
    this.showButton = !this.showButton;
  }
}
