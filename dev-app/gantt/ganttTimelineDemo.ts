import { dependencyData, clone } from './ganttData';
import { logEvent } from './ganttLog';

/** Timeline, calendars, markers and the taskbar / timeline templates. */
export class GanttTimelineDemo {
  log = logEvent;
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 200 },
    { field: 'Duration', headerText: 'Duration', width: 100 }
  ];
  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', dependency: 'Predecessor',
    baselineStartDate: 'BaselineStartDate', baselineEndDate: 'BaselineEndDate'
  };

  // timeline settings and zooming
  timelineData = clone(dependencyData);
  timelineSettings = { timelineViewMode: 'Week', timelineUnitSize: 80, weekStartDay: 1, weekendBackground: '#fde2e2', showTooltip: true, updateTimescaleView: true };
  zoomingLevels = [
    { timelineViewMode: 'Month', timelineUnitSize: 60, topTier: { unit: 'Year', format: 'yyyy' }, bottomTier: { unit: 'Month', format: 'MMM' } },
    { timelineViewMode: 'Week', timelineUnitSize: 80, topTier: { unit: 'Month', format: 'MMM yyyy' }, bottomTier: { unit: 'Week', format: 'dd' } },
    { timelineViewMode: 'Day', timelineUnitSize: 40, topTier: { unit: 'Week', format: 'MMM dd' }, bottomTier: { unit: 'Day', format: 'd' } }
  ];
  zoomToolbar = ['ZoomIn', 'ZoomOut', 'ZoomToFit'];

  // calendar, holidays and markers
  calendarData = clone(dependencyData);
  holidays = [{ from: '2025-04-09', to: '2025-04-10', label: 'Company holiday', cssClass: 'gantt-holiday' }];
  eventMarkers = [{ day: '2025-04-08', label: 'Kickoff', cssClass: 'gantt-marker' }];
  dayWorkingTime = [{ from: 9, to: 13 }, { from: 14, to: 18 }];
  weekWorkingTime = [{ dayOfWeek: 'Friday', timeRange: [{ from: 9, to: 13 }] }];
  calendarSettings = {
    projectCalendar: { workingTime: [{ from: 9, to: 18 }], holidays: [{ from: '2025-04-14', to: '2025-04-14', label: 'Calendar holiday' }] },
    taskCalendars: [{ calendarId: 'half', workingTime: [{ from: 9, to: 13 }] }]
  };
  hourTimeline = { timelineViewMode: 'Hour', timelineUnitSize: 60 };

  // baseline and critical path
  baselineData = clone(dependencyData);
  criticalToolbar = ['CriticalPath'];
  baselineTemplate = '<div class="gantt-baseline-template">baseline</div>';

  // templates
  templateData = clone(dependencyData).map((r: any) => (r.TaskID === 5 ? { ...r, Duration: 0 } : r));
  taskbarTemplate = '<div class="gantt-taskbar-template">${TaskName}</div>';
  parentTaskbarTemplate = '<div class="gantt-parent-template">parent ${TaskName}</div>';
  milestoneTemplate = '<div class="gantt-milestone-template">M</div>';
  timelineTemplate = '<div class="gantt-timeline-template">${value}</div>';
  templateFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', dependency: 'Predecessor'
  };

  // virtualization
  bigData = (() => {
    const rows: any[] = [];
    for (let i = 1; i <= 200; i++) {
      rows.push({ TaskID: i, TaskName: 'Task ' + i, StartDate: new Date(2025, 3, 1 + (i % 20)), Duration: 1 + (i % 5), Progress: i % 100 });
    }
    return rows;
  })();
  bigFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress' };
  infiniteTimeline = { timelineViewMode: 'Month', timelineUnitSize: 60 };

  // inline notes and unscheduled tasks
  noteData = [
    { TaskID: 1, TaskName: 'Scheduled task', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 20, Notes: 'Inline note text' },
    { TaskID: 2, TaskName: 'Unscheduled task', Duration: 3 },
    { TaskID: 3, TaskName: 'Another task', StartDate: new Date('04/07/2025'), Duration: 2 }
  ];
  noteFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', notes: 'Notes' };
}
