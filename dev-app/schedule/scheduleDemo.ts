import { ScheduleModel } from '@syncfusion/ej2-schedule';

export class ScheduleDemo {
  showSchedule = true;
  selectedDate = new Date(2024, 4, 15);
  currentView = 'Week';
  eventClicks = 0;
  lastEvent = '';

  eventSettings = {
    dataSource: [
      { Id: 1, Subject: 'Planning', StartTime: new Date(2024, 4, 15, 10, 0), EndTime: new Date(2024, 4, 15, 11, 30) },
      { Id: 2, Subject: 'Review', StartTime: new Date(2024, 4, 16, 14, 0), EndTime: new Date(2024, 4, 16, 15, 0) },
      { Id: 3, Subject: 'Offsite', StartTime: new Date(2024, 4, 17, 0, 0), EndTime: new Date(2024, 4, 18, 0, 0), IsAllDay: true }
    ]
  };

  modelConfigured: ScheduleModel = { selectedDate: new Date(2024, 4, 15), currentView: 'Month', eventSettings: this.eventSettings };

  toggle() {
    this.showSchedule = !this.showSchedule;
  }

  onEventClick(event: CustomEvent) {
    this.eventClicks++;
    this.lastEvent = event.detail.event.Subject;
  }
}
