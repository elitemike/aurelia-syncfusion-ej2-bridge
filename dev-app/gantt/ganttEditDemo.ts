import { dependencyData, projectData, clone } from './ganttData';
import { logEvent } from './ganttLog';
import { Ej2Gantt } from 'widgets/gantt/ej2-gantt';
import { viewResources } from 'aurelia-framework';

/** Editing, dependencies, undo / redo and custom data binding. */
@viewResources(Ej2Gantt)
export class GanttEditDemo {
  log = logEvent;
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70, isPrimaryKey: true },
    { field: 'TaskName', headerText: 'Name', width: 220, allowEditing: true },
    { field: 'Duration', headerText: 'Duration', width: 100 },
    { field: 'Progress', headerText: 'Progress', width: 100 }
  ];
  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', dependency: 'Predecessor', child: 'subtasks'
  };

  // editing with dialogs and toolbar
  editData = clone(projectData);
  editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, allowTaskbarEditing: true, showDeleteConfirmDialog: false, mode: 'Auto' };
  editToolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'];
  addDialogFields = [
    { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'StartDate', 'Duration'] },
    { type: 'Dependency' }
  ];
  editDialogFields = [
    { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'StartDate', 'Duration', 'Progress'] },
    { type: 'Dependency' },
    { type: 'Notes' }
  ];
  lastAction = '';
  lastTaskbarAction = '';

  // cell editing
  cellData = clone(projectData);
  cellSettings = { allowEditing: true, mode: 'Auto' };

  // dependencies
  depData = clone(dependencyData);
  depSettings = { allowAdding: true, allowEditing: true, allowTaskbarEditing: true, allowTaskbarDraw: true };
  depState = { validation: false };

  // undo and redo
  undoData = clone(dependencyData);
  undoToolbar = ['Undo', 'Redo'];
  undoActions = ['Edit', 'Add', 'Delete', 'Indent', 'Outdent'];
  undoSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, allowTaskbarEditing: true };

  // read only
  readOnlyData = clone(dependencyData);

  // manual scheduling
  manualData = [
    { TaskID: 1, TaskName: 'Manual task', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 10, isManual: true },
    { TaskID: 2, TaskName: 'Auto task', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 10, isManual: false }
  ];
  manualFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', manual: 'isManual' };

  // custom data binding: the app owns the data
  stateAll = clone(projectData);
  stateSource: any = { result: this.stateAll, count: this.stateAll.length };
  stateLast = '';
  stateChanged = '';

  onActionComplete(event: CustomEvent) {
    this.lastAction = event.detail.requestType;
    logEvent('actionComplete', event);
  }

  onTaskbarEdited(event: CustomEvent) {
    this.lastTaskbarAction = event.detail.taskBarEditAction;
    logEvent('taskbarEdited', event);
  }

  onDataStateChange(event: CustomEvent) {
    logEvent('dataStateChange', event);
    const action = event.detail.action;
    this.stateLast = action ? action.requestType : 'init';
    this.stateSource = { result: this.stateAll, count: this.stateAll.length };
  }

  onDataSourceChanged(event: CustomEvent) {
    logEvent('dataSourceChanged', event);
    this.stateChanged = event.detail.requestType || event.detail.action || 'changed';
  }
}
