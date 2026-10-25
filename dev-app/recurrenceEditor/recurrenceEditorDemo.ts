export class RecurrenceEditorDemo {
  startDate = new Date(2024, 0, 10);
  rule = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
  changeCount = 0;
  changeValue: string = null;

  frequencies = ['none', 'daily', 'weekly', 'yearly'];
  endTypes = ['never', 'count'];
  firstDayOfWeek = 1;
  selectedType = 0;

  untilRule = 'FREQ=DAILY;INTERVAL=1;UNTIL=20240301T120000Z';
  minDate = new Date(2024, 0, 1);
  maxDate = new Date(2024, 11, 31);
  calendarMode = 'Gregorian';

  showEditor = true;
  createdCount = 0;
  destroyedCount = 0;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
  }

  setRule() {
    this.rule = 'FREQ=WEEKLY;BYDAY=MO,WE;INTERVAL=2;COUNT=4';
  }
}
