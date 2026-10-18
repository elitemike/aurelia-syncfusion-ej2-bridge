export class TimePickerDemo {
  value = new Date(2024, 4, 15, 9, 30);
  min = new Date(2024, 4, 15, 8, 0);
  max = new Date(2024, 4, 15, 12, 0);
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = new Date(2024, 4, 15, 11, 0);
  }

  get display() {
    if (!this.value) { return ''; }
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(this.value.getHours())}:${p(this.value.getMinutes())}`;
  }
}
