import { ScheduleModel } from '@syncfusion/ej2-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

const eventNames = [
  'actionBegin', 'actionComplete', 'actionFailure', 'cellClick', 'cellDoubleClick', 'created', 'dataBinding', 'dataBound',
  'destroyed', 'drag', 'dragStart', 'dragStop', 'eventClick', 'eventRendered', 'hover', 'moreEventsClick', 'navigating',
  'popupClose', 'popupOpen', 'renderCell', 'resizeStart', 'resizeStop', 'resizing', 'select', 'eventDoubleClick',
  'virtualScrollStart', 'virtualScrollStop', 'beforePaste', 'beforePrint', 'excelExport', 'tooltipOpen',
  'beforeWebMcpToolExecute'
];

export class ScheduleDemo {
  showSchedule = true;
  selectedDate = new Date(2024, 4, 15);
  fixedDate = new Date(2024, 4, 15);
  currentView = 'Week';
  eventClicks = 0;
  lastEvent = '';

  // generic event bookkeeping, every handler calls track() so the demo can show how often it fired
  eventNames = eventNames;
  counts: { [name: string]: number } = {};
  details: { [name: string]: string } = {};

  eventSettings = {
    enableTooltip: true,
    dataSource: [
      { Id: 1, Subject: 'Planning', StartTime: new Date(2024, 4, 15, 10, 0), EndTime: new Date(2024, 4, 15, 11, 30) },
      { Id: 2, Subject: 'Review', StartTime: new Date(2024, 4, 16, 14, 0), EndTime: new Date(2024, 4, 16, 15, 0) },
      { Id: 3, Subject: 'Offsite', StartTime: new Date(2024, 4, 17, 0, 0), EndTime: new Date(2024, 4, 18, 0, 0), IsAllDay: true }
    ]
  };

  modelConfigured: ScheduleModel = { selectedDate: new Date(2024, 4, 15), currentView: 'Month', eventSettings: this.eventSettings };

  // layout section
  layout: any = {
    width: '900px',
    height: '460px',
    cssClass: 'my-sch',
    startHour: '08:00',
    endHour: '20:00',
    workHours: { highlight: true, start: '10:00', end: '16:00' },
    workDays: [1, 2, 3, 4],
    firstDayOfWeek: 1,
    showWeekend: true,
    showWeekNumber: true,
    weekRule: 'FirstFullWeek',
    timeScale: { enable: true, interval: 60, slotCount: 4 },
    timeFormat: 'HH:mm',
    dateFormat: 'dd MMM yyyy',
    showHeaderBar: true,
    showTimeIndicator: true,
    currentTimeIndicatorSettings: { showTime: false, showPreviousDates: true, onTop: true },
    rowAutoHeight: false,
    enableAllDayScroll: true,
    timezone: 'UTC',
    timezoneDataSource: [{ Value: 'UTC', Text: 'UTC' }, { Value: 'Europe/Paris', Text: 'Paris' }],
    calendarMode: 'Gregorian',
    enableHtmlSanitizer: true
  };

  flipLayout() {
    Object.assign(this.layout, {
      cssClass: 'my-sch2',
      startHour: '09:00',
      endHour: '18:00',
      firstDayOfWeek: 0,
      showWeekNumber: false,
      timeFormat: 'hh:mm a',
      showWeekend: false,
      workDays: [1, 2, 3, 4, 5],
      showHeaderBar: false,
      rowAutoHeight: true,
      width: '800px',
      height: '400px'
    });
  }

  // toolbar and header templates
  toolbarItems = [
    { name: 'Previous' }, { name: 'DateRangeText' }, { name: 'Next' }, { name: 'Today' }, { name: 'Views' }, { name: 'NewEvent' }
  ];
  limitedViews = ['Day', 'Week'];
  tpl = {
    dateRange: '<div class="tpl-range">Range template</div>',
    dateHeader: '<div class="tpl-date">DH</div>',
    cell: '<div class="tpl-cell">C</div>',
    cellHeader: '<div class="tpl-cell-header">CH</div>',
    dayHeader: '<div class="tpl-day-header">DY</div>',
    monthHeader: '<div class="tpl-month-header">MH</div>',
    resourceHeader: '<div class="tpl-resource">RH</div>',
    headerIndent: '<div class="tpl-indent">HI</div>',
    editorHeader: '<div class="tpl-editor-header">Editor header</div>',
    editorFooter: '<div class="tpl-editor-footer">Editor footer</div>',
    editor: '<table class="tpl-editor"><tr><td><input class="e-field e-input" name="Subject" /></td></tr></table>'
  };
  quickInfoTemplates = {
    header: '<div class="tpl-qi-header">QI header</div>',
    content: '<div class="tpl-qi-content">QI content</div>',
    footer: '<div class="tpl-qi-footer">QI footer</div>'
  };

  // agenda section
  agendaDate = new Date(2024, 4, 20);
  agendaViews = ['Agenda', 'Month'];

  // year section
  yearHeaderRows = [{ option: 'Year' }, { option: 'Month' }];

  // flags section
  flags: any = {
    readonly: false,
    allowDragAndDrop: false,
    allowResizing: false,
    allowMultiDrag: true,
    allowKeyboardInteraction: false,
    allowSwiping: false,
    allowOverlap: false,
    allowInline: true,
    allowMultiCellSelection: false,
    allowMultiRowSelection: false,
    quickInfoOnSelectionEnd: true,
    showQuickInfo: false,
    enableRecurrenceValidation: false,
    prerenderDialogs: true,
    overscanCount: 5,
    allowClipboard: true,
    enableAdaptiveUI: true,
    minDate: new Date(2024, 4, 13),
    maxDate: new Date(2024, 4, 19)
  };

  flipFlags() {
    Object.assign(this.flags, {
      readonly: true,
      allowDragAndDrop: true,
      allowResizing: true,
      allowMultiDrag: false,
      allowKeyboardInteraction: true,
      allowSwiping: true,
      allowOverlap: true,
      allowInline: false,
      allowMultiCellSelection: true,
      allowMultiRowSelection: true,
      quickInfoOnSelectionEnd: false,
      showQuickInfo: true,
      enableRecurrenceValidation: true,
      overscanCount: 3,
      allowClipboard: false,
      enableAdaptiveUI: false,
      minDate: new Date(2024, 4, 10),
      maxDate: new Date(2024, 4, 25)
    });
  }

  // resources section
  resources = [{
    field: 'RoomId', title: 'Room', name: 'Rooms', textField: 'Name', idField: 'Id', colorField: 'Color',
    dataSource: [{ Id: 1, Name: 'Room A', Color: '#1aaa55' }, { Id: 2, Name: 'Room B', Color: '#357cd2' }]
  }];
  group = { resources: ['Rooms'] };
  resourceEvents = {
    dataSource: [
      { Id: 11, Subject: 'In A', StartTime: new Date(2024, 4, 15, 10, 0), EndTime: new Date(2024, 4, 15, 11, 0), RoomId: 1 },
      { Id: 12, Subject: 'In B', StartTime: new Date(2024, 4, 15, 12, 0), EndTime: new Date(2024, 4, 15, 13, 0), RoomId: 2 }
    ]
  };
  selectedResource = 2;

  // month section with a crowded day for moreEventsClick
  crowdedEvents = {
    dataSource: [1, 2, 3, 4, 5, 6].map(i => ({
      Id: 100 + i, Subject: `Crowd ${i}`, StartTime: new Date(2024, 4, 15, 8 + i, 0), EndTime: new Date(2024, 4, 15, 9 + i, 0)
    }))
  };

  // virtual scrolling with many resources
  virtualViews = [{ option: 'TimelineDay', allowVirtualScrolling: true }];
  virtualResources = [{
    field: 'ResId', title: 'Resource', name: 'VRes', textField: 'Name', idField: 'Id',
    dataSource: Array.from({ length: 60 }, (_, i) => ({ Id: i + 1, Name: `Res ${i + 1}` }))
  }];
  virtualGroup = { resources: ['VRes'] };
  virtualEvents = {
    dataSource: Array.from({ length: 60 }, (_, i) => ({
      Id: 200 + i, Subject: `Task ${i + 1}`, StartTime: new Date(2024, 4, 15, 9, 0), EndTime: new Date(2024, 4, 15, 10, 0), ResId: i + 1
    }))
  };

  // failing remote data to raise actionFailure
  failingEvents: any = { dataSource: new DataManager({ url: 'data:text/plain,not-json', adaptor: new WebApiAdaptor() }) };

  // export section
  scheduleExport: any;
  scheduleMcp: any;

  constructor() {
    eventNames.forEach(name => { this.counts[name] = 0; this.details[name] = ''; });
  }

  toggle() {
    this.showSchedule = !this.showSchedule;
  }

  track(name: string, event: CustomEvent) {
    this.counts[name] = this.counts[name] + 1;
    const d: any = event.detail || {};
    this.details[name] = describe(name, d);
    if (name === 'beforePrint' || name === 'excelExport') {
      // keep the demo from opening a print window or downloading a file
      d.cancel = true;
    }
    if (name === 'beforePaste') {
      d.cancel = true;
    }
    if (name === 'popupOpen' && d.type === 'Editor' && d.data && !d.data.Subject) {
      d.data.Subject = 'From popup';
    }
  }

  onEventClick(event: CustomEvent) {
    this.eventClicks++;
    this.lastEvent = event.detail.event.Subject;
  }

  goToJune() {
    this.selectedDate = new Date(2024, 5, 5);
  }

  setDayView() {
    this.currentView = 'Day';
  }

  print() {
    this.scheduleExport.widget.print();
  }

  exportExcel() {
    this.scheduleExport.widget.exportToExcel();
  }
}

function describe(name: string, d: any): string {
  switch (name) {
    case 'eventClick':
    case 'eventDoubleClick':
      return d.event ? d.event.Subject : '';
    case 'eventRendered':
      return d.data ? d.data.Subject : '';
    case 'popupOpen':
    case 'popupClose':
      return d.type || '';
    case 'drag':
    case 'dragStart':
    case 'dragStop':
    case 'resizeStart':
    case 'resizing':
    case 'resizeStop':
      return d.data ? d.data.Subject : '';
    case 'navigating':
      return `${d.action}`;
    case 'cellClick':
    case 'cellDoubleClick':
      return d.startTime ? d.startTime.getHours() + '' : '';
    case 'beforeWebMcpToolExecute':
      return d.toolName || '';
    case 'moreEventsClick':
      return d.viewName || '';
    case 'actionBegin':
    case 'actionComplete':
      return d.requestType || '';
    case 'virtualScrollStart':
    case 'virtualScrollStop':
      return d.startIndex + '-' + d.endIndex;
    default:
      return '';
  }
}
