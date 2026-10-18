export class DatePickerDemo {
  value: Date = new Date(2024, 4, 15);
  min = new Date(2024, 4, 1);
  max = new Date(2024, 4, 31);
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setDate() {
    this.value = new Date(2024, 4, 20);
  }
}
