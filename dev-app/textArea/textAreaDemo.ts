export class TextAreaDemo {
  value = 'initial';
  inputCount = 0;
  focused = false;
  changeCount = 0;
  changeValue: string = null;

  readonly = true;
  enabled = false;

  cols = 30;
  rows = 2;
  width = '300px';
  maxLength = 20;
  resizeMode = 'Vertical';
  cssClass = 'ta-custom';
  htmlAttrs = { 'data-foo': 'bar' };

  prepend = '<span class="ta-prepend">pre</span>';
  append = '<span class="ta-append">app</span>';
  flow = 'Horizontal';
  orientation = 'Horizontal';

  showBox = true;
  createdCount = 0;
  destroyedCount = 0;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
  }

  vertical() {
    this.flow = 'Vertical';
    this.orientation = 'Vertical';
  }

  toggleStates() {
    this.readonly = !this.readonly;
    this.enabled = !this.enabled;
  }

  changeSize() {
    this.cols = 40;
    this.rows = 5;
    this.width = '400px';
    this.maxLength = 10;
    this.resizeMode = 'Horizontal';
    this.cssClass = 'ta-custom-two';
    this.htmlAttrs = { 'data-foo': 'baz' };
  }
}
