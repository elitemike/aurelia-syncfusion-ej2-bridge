import { resourceTaskData, resourceCollection, clone } from './ganttData';
import { logEvent } from './ganttLog';

/** Resources, resource view, over allocation, segments and the destroy lifecycle. */
export class GanttResourceDemo {
  log = logEvent;
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 220 },
    { field: 'resources', headerText: 'Resources', width: 160 },
    { field: 'Duration', headerText: 'Duration', width: 100 }
  ];
  taskFields = {
    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate', duration: 'Duration', progress: 'Progress',
    parentID: 'ParentID', resourceInfo: 'resources'
  };
  resourceFields = { id: 'resourceId', name: 'resourceName' };

  // project view with resources
  projectView = clone(resourceTaskData);
  resources = clone(resourceCollection);
  editSettings = { allowEditing: true, allowAdding: true, allowTaskbarEditing: true };
  toolbar = ['Add', 'Edit', 'Update', 'Cancel'];
  workUnit = 'Hour';
  taskType = 'FixedWork';

  // resource view
  resourceView = clone(resourceTaskData);
  resourceIDMapping = 'resourceId';
  resourceNameMapping = 'resourceName';

  // segments
  segmentRows = [
    {
      TaskID: 1, TaskName: 'Segmented task', StartDate: new Date('04/02/2025'), Duration: 6, Progress: 30,
      Segments: [{ StartDate: new Date('04/02/2025'), Duration: 2 }, { StartDate: new Date('04/07/2025'), Duration: 3 }]
    },
    { TaskID: 2, TaskName: 'Plain task', StartDate: new Date('04/02/2025'), Duration: 3, Progress: 0 }
  ];
  segmentFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', segments: 'Segments' };
  segmentData = [{ TaskID: 1, Segments: [{ StartDate: new Date('04/02/2025'), Duration: 2 }] }];

  // destroy lifecycle
  showDestroy = true;
  destroyData = clone(resourceTaskData);
  destroyFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', parentID: 'ParentID' };
}
