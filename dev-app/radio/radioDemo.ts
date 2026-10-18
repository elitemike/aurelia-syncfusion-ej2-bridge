export class RadioDemo {
  showRadio = true;
  first = false;
  second = true;
  disabled = false;

  toggle() {
    this.showRadio = !this.showRadio;
  }

  selectFirst() {
    this.first = true;
  }
}
