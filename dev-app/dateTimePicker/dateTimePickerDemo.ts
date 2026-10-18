export class DateTimePickerDemo {
  value = new Date(2024, 4, 15, 9, 30);
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = new Date(2024, 4, 20, 14, 0);
  }
}
