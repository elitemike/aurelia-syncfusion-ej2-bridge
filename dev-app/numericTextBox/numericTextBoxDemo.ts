export class NumericTextBoxDemo {
  value = 10;
  price = 12.5;
  changeCount = 0;

  currencyCode = 'USD';
  allowWheel = true;
  readonly = false;
  enabled = true;
  focusCount = 0;
  blurCount = 0;
  cssClass = 'ntb-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  prepend = '<span class="ntb-prepend">pre</span>';
  append = '<span class="ntb-append">app</span>';
  showBox = true;
  createdCount = 0;
  destroyedCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = 42;
  }
}
