import { Ej2Calendar } from 'widgets/calendar/ej2-calendar';
import { viewResources } from 'aurelia-framework';
function iso(date: Date) {
  if (!date) {
    return '';
  }
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

@viewResources(Ej2Calendar)
export class CalendarDemo {
  value = new Date(2024, 4, 15);
  newValue = new Date(2024, 5, 20);
  changeCount = 0;
  interacted: boolean = null;
  navigatedView = '';
  navigations = 0;
  createdCount = 0;

  values: Date[] = [new Date(2024, 4, 3), new Date(2024, 4, 4)];
  multiValue = new Date(2024, 4, 4);
  presetValues = [new Date(2024, 4, 10), new Date(2024, 4, 11), new Date(2024, 4, 12)];

  min = new Date(2024, 4, 5);
  max = new Date(2024, 4, 25);
  rangeValue = new Date(2024, 4, 15);
  enabled = true;
  cssClass = 'cal-custom';

  start = 'Year';
  depth = 'Year';
  calendarMode = 'Gregorian';
  viewValue = new Date(2024, 4, 15);

  weekValue = new Date(2024, 4, 15);
  weekRule = 'FirstFourDayWeek';
  firstDay = 1;
  headerFormat = 'Narrow';
  showToday = true;

  cellValue = new Date(2024, 4, 15);
  cellCount = 0;

  keyValue = new Date(2024, 4, 15);
  keyConfigs = { moveRight: 'alt+l' };
  timezoneOffset = 14;
  tzValue = new Date(2024, 4, 15, 12, 0, 0);

  showCalendar = true;
  destroyedCount = 0;

  get valueText() {
    return iso(this.value);
  }

  get valuesText() {
    return (this.values || []).map(iso).join(',');
  }

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.interacted = event.detail.isInteracted;
  }

  onNavigated(event: CustomEvent) {
    this.navigations++;
    this.navigatedView = event.detail.view;
  }

  decadeView() {
    this.start = 'Decade';
    this.depth = 'Year';
  }

  changeRange() {
    this.min = new Date(2024, 4, 10);
    this.max = new Date(2024, 4, 20);
    this.cssClass = 'cal-custom-two';
  }

  changeWeek() {
    this.weekRule = 'FirstFullWeek';
    this.firstDay = 0;
    this.headerFormat = 'Abbreviated';
    this.showToday = false;
  }

  onRenderDay(event: CustomEvent) {
    this.cellCount++;
    const args = event.detail;
    const day = args.date.getDay();
    if (day === 0 || day === 6) {
      args.isDisabled = true;
    }
    if (args.date.getDate() === 14) {
      args.element.classList.add('special-day');
    }
  }
}
