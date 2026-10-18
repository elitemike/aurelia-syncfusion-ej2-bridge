export class TextBoxDemo {
  value = 'initial';
  inputCount = 0;
  focused = false;

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
