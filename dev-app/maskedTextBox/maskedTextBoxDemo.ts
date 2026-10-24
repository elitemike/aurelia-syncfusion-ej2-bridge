export class MaskedTextBoxDemo {
  phone: string = null;
  changeCount = 0;

  customChars = { P: 'P,p' };
  cssClass = 'mtb-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  prepend = '<span class="mtb-prepend">pre</span>';
  append = '<span class="mtb-append">app</span>';
  enabled = true;
  focusCount = 0;
  blurCount = 0;
  showBox = true;
  createdCount = 0;
  destroyedCount = 0;

  onChange() {
    this.changeCount++;
  }

  setPhone() {
    this.phone = '5551234567';
  }
}
