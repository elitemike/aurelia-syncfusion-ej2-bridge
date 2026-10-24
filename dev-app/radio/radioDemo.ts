export class RadioDemo {
  showRadio = true;
  first = false;
  second = true;
  disabled = false;

  moreLabel = 'More <b class="rdo-bold">choice</b>';
  inputValue = 'r1';
  cssClass = 'rdo-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  changeCount = 0;
  changeValue: string = null;
  createdCount = 0;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
  }

  toggle() {
    this.showRadio = !this.showRadio;
  }

  selectFirst() {
    this.first = true;
  }
}
