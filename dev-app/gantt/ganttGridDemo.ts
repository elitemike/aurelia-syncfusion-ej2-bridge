import { projectData, dependencyData, clone } from './ganttData';
import { logEvent } from './ganttLog';

/** The grid half of the gantt: sorting, filtering, searching, menus, columns, splitter and drag and drop. */
export class GanttGridDemo {
  log = logEvent;
  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', dependency: 'Predecessor', child: 'subtasks'
  };
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 220 },
    { field: 'StartDate', headerText: 'Start Date', width: 120 },
    { field: 'Duration', headerText: 'Duration', width: 100 },
    { field: 'Progress', headerText: 'Progress', width: 100 }
  ];

  sortData = clone(projectData);
  sortSettings = { columns: [{ field: 'TaskName', direction: 'Descending' }] };

  filterData = clone(projectData);
  filterSettings = { type: 'Menu', hierarchyMode: 'Parent' };
  searchSettings = { fields: ['TaskName'], operator: 'contains', ignoreCase: true, hierarchyMode: 'Parent' };
  searchToolbar = ['Search'];

  menuData = clone(projectData);
  columnMenuItems = ['SortAscending', 'SortDescending', 'ColumnChooser'];
  contextMenuItems = ['TaskInformation', 'Above', 'Below', 'DeleteTask', 'Indent', 'Outdent'];
  menuEdit = { allowAdding: true, allowEditing: true, allowDeleting: true };

  columnData = clone(projectData);
  checkboxMode = 'Default';
  splitterSettings = { position: '50%', minimum: '200px' };

  checkData = clone(projectData);
  checkColumns = [
    { field: 'TaskName', headerText: 'Name', width: 250, showCheckbox: true },
    { field: 'Duration', headerText: 'Duration', width: 100 }
  ];

  ddData = clone(projectData);
  ddEdit = { allowEditing: true, allowAdding: true, allowTaskbarEditing: true };
  taskbarDdData = clone(dependencyData);
}
