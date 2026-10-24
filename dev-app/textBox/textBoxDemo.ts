export class TextBoxDemo {
  value = 'initial';
  inputCount = 0;
  focused = false;

  cssClass = 'tb-custom';
  htmlAttrs = { 'data-foo': 'bar', 'data-baz': 'qux' };
  prepend = '<span class="tb-prepend">pre</span>';
  append = '<span class="tb-append">app</span>';
  moreValue = '';
  changeCount = 0;
  changeValue: string = null;
  showBox = true;
  createdCount = 0;
  destroyedCount = 0;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
  }

  onCreated() {
    this.createdCount++;
  }

  onDestroyed() {
    this.destroyedCount++;
  }

  onInput() {
    this.inputCount++;
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
  }

  setValue() {
    this.value = 'from view-model';
  }
}
