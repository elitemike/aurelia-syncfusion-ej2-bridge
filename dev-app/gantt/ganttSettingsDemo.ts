import { Query } from '@syncfusion/ej2-data';
import { projectData, clone } from './ganttData';
import { logEvent } from './ganttLog';
import { Ej2Gantt } from 'widgets/gantt/ej2-gantt';
import { viewResources } from 'aurelia-framework';

/** Project level settings: work time units, dates, look and feel, labels, WBS and the like. */
@viewResources(Ej2Gantt)
export class GanttSettingsDemo {
  log = logEvent;
  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate', duration: 'Duration',
    progress: 'Progress', dependency: 'Predecessor', child: 'subtasks'
  };
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 250 },
    { field: 'StartDate', headerText: 'Start Date', width: 120 },
    { field: 'Duration', headerText: 'Duration', width: 100 }
  ];

  // time units
  unitData = clone(projectData);
  workWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dateFormat = 'yyyy-MM-dd';
  timezone = 'UTC';

  // look
  lookData = clone(projectData);
  lookState = { height: 320, rowHeight: 40, taskbarHeight: 24, hover: false, lines: 'Both', collapsed: false };
  labelSettings = { leftLabel: 'TaskName', rightLabel: 'Progress', taskLabel: '${Progress}%' };
  loadingIndicator = { indicatorType: 'Shimmer' };
  tooltipSettings = { showTooltip: true };
  splitterSettings = { columnIndex: 2, position: '40%' };
  allowedDependencyTypes = ['FS', 'SS'];

  // WBS, serial number and miscellaneous behaviour
  wbsData = clone(projectData);
  wbsColumns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 250 }
  ];
  query = new Query().take(10);
  webMcpSettings = { name: 'ganttDemo' };

  // empty
  emptyData: any[] = [];
  emptyTemplate = '<span class="gantt-empty">No tasks yet</span>';

  // on demand
  demandData = [
    { TaskID: 1, TaskName: 'Parent A', StartDate: new Date('04/02/2025'), Duration: 5 },
    { TaskID: 2, TaskName: 'Child A1', StartDate: new Date('04/02/2025'), Duration: 3, ParentID: 1 },
    { TaskID: 3, TaskName: 'Parent B', StartDate: new Date('04/09/2025'), Duration: 5 },
    { TaskID: 4, TaskName: 'Child B1', StartDate: new Date('04/09/2025'), Duration: 3, ParentID: 3 }
  ];
  demandFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', parentID: 'ParentID' };

  changeLook() {
    this.lookState.height = 260;
    this.lookState.rowHeight = 50;
    this.lookState.taskbarHeight = 30;
    this.lookState.hover = true;
    this.lookState.lines = 'None';
  }
}
