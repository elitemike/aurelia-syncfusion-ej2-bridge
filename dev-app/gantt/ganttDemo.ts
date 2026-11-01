import { PLATFORM } from 'aurelia-pal';
import { projectData, clone } from './ganttData';
import { logEvent } from './ganttLog';
import { Ej2Gantt } from 'widgets/gantt/ej2-gantt';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Gantt)
export class GanttDemo {
  log = logEvent;
  parts = [
    PLATFORM.moduleName('gantt/ganttSettingsDemo'),
    PLATFORM.moduleName('gantt/ganttTimelineDemo'),
    PLATFORM.moduleName('gantt/ganttEditDemo'),
    PLATFORM.moduleName('gantt/ganttGridDemo'),
    PLATFORM.moduleName('gantt/ganttResourceDemo'),
    PLATFORM.moduleName('gantt/ganttExportDemo')
  ];

  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate', duration: 'Duration',
    progress: 'Progress', dependency: 'Predecessor', child: 'subtasks'
  };
  data = clone(projectData);
  selectedRowIndex = -1;
  selectionSettings = { mode: 'Both', type: 'Single' };
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 250 },
    { field: 'StartDate', headerText: 'Start Date', width: 120 },
    { field: 'Duration', headerText: 'Duration', width: 100 },
    { field: 'Progress', headerText: 'Progress', width: 100 }
  ];
  selectedFromEvent = '';
  mouseMoves = 0;

  onRowSelected(event: CustomEvent) {
    this.selectedFromEvent = event.detail.data.TaskItem ? event.detail.data.TaskItem.TaskName : event.detail.data.taskData.TaskName;
    logEvent('rowSelected', event);
  }
}
