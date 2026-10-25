/** Local data for the Gantt demos, modelled on the Syncfusion "Default functionalities" project sample. */
export const projectData: any[] = [
  {
    TaskID: 1, TaskName: 'Project Initiation', StartDate: new Date('04/02/2025'), EndDate: new Date('04/21/2025'),
    subtasks: [
      { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 50 },
      { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 50 },
      { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 50 }
    ]
  },
  {
    TaskID: 5, TaskName: 'Project Estimation', StartDate: new Date('04/02/2025'), EndDate: new Date('04/21/2025'),
    subtasks: [
      { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2025'), Duration: 3, Progress: 50 },
      { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2025'), Duration: 3, Progress: 50 },
      { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2025'), Duration: 3, Progress: 50 }
    ]
  }
];

/** Tasks with predecessors, the critical path and baseline dates. */
export const dependencyData: any[] = [
  { TaskID: 1, TaskName: 'Foundation', StartDate: new Date('04/07/2025'), Duration: 4, Progress: 40, BaselineStartDate: new Date('04/07/2025'), BaselineEndDate: new Date('04/10/2025') },
  { TaskID: 2, TaskName: 'Framing', StartDate: new Date('04/07/2025'), Duration: 5, Progress: 20, Predecessor: '1FS', BaselineStartDate: new Date('04/11/2025'), BaselineEndDate: new Date('04/17/2025') },
  { TaskID: 3, TaskName: 'Roofing', StartDate: new Date('04/07/2025'), Duration: 3, Progress: 0, Predecessor: '2FS', BaselineStartDate: new Date('04/18/2025'), BaselineEndDate: new Date('04/22/2025') },
  { TaskID: 4, TaskName: 'Landscaping', StartDate: new Date('04/07/2025'), Duration: 2, Progress: 0, Predecessor: '1FS' },
  { TaskID: 5, TaskName: 'Handover', StartDate: new Date('04/07/2025'), Duration: 1, Progress: 0, Predecessor: '3FS,4FS' }
];

/** Flat tasks with a resource column. */
export const resourceTaskData: any[] = [
  { TaskID: 1, TaskName: 'Project initiation', StartDate: new Date('04/02/2025'), EndDate: new Date('04/21/2025') },
  { TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 30, ParentID: 1, resources: [{ resourceId: 1, resourceUnit: 50 }] },
  { TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/02/2025'), Duration: 4, Progress: 40, ParentID: 1, resources: [{ resourceId: 2, resourceUnit: 70 }, { resourceId: 3 }] },
  { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/08/2025'), Duration: 2, Progress: 0, ParentID: 1, resources: [{ resourceId: 3 }] }
];

export const resourceCollection: any[] = [
  { resourceId: 1, resourceName: 'Martin Tamer' },
  { resourceId: 2, resourceName: 'Rose Fuller' },
  { resourceId: 3, resourceName: 'Margaret Buchanan' }
];

/** Deep copy that keeps the Date values, every editable sample works on its own copy. */
export const clone = (rows: any[]): any[] => JSON.parse(JSON.stringify(rows), (k, v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v);
