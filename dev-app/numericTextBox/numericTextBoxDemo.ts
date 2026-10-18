export class NumericTextBoxDemo {
  value = 10;
  price = 12.5;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = 42;
  }
}
