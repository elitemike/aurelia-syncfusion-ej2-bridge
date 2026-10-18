export class DateRangePickerDemo {
  startDate = new Date(2024, 4, 10);
  endDate = new Date(2024, 4, 20);
  changeCount = 0;
  presets = [
    { label: 'Next 3 days', start: new Date(2024, 4, 11), end: new Date(2024, 4, 13) },
    { label: 'Whole week', start: new Date(2024, 4, 6), end: new Date(2024, 4, 12) }
  ];

  onChange() {
    this.changeCount++;
  }

  setRange() {
    this.startDate = new Date(2024, 4, 1);
    this.endDate = new Date(2024, 4, 3);
  }
}
