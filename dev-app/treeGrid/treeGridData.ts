/** Local data for the Tree Grid demos, modelled on the Syncfusion "Sample data" / self-referential samples. */
export const hierarchicalData: any[] = [
  {
    taskID: 1, taskName: 'Planning', startDate: new Date('02/03/2025'), endDate: new Date('02/07/2025'), progress: 100, duration: 5, priority: 'Normal', approved: false,
    subtasks: [
      { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2025'), endDate: new Date('02/07/2025'), duration: 5, progress: 100, priority: 'Normal', approved: false },
      { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2025'), endDate: new Date('02/07/2025'), duration: 5, progress: 100, priority: 'Low', approved: true },
      { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2025'), endDate: new Date('02/07/2025'), duration: 5, progress: 100, priority: 'Critical', approved: false },
      { taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2025'), endDate: new Date('02/10/2025'), duration: 0, progress: 0, priority: 'Low', approved: true }
    ]
  },
  {
    taskID: 6, taskName: 'Design', startDate: new Date('02/10/2025'), endDate: new Date('02/14/2025'), duration: 3, progress: 86, priority: 'High', approved: false,
    subtasks: [
      { taskID: 7, taskName: 'Software specification', startDate: new Date('02/10/2025'), endDate: new Date('02/12/2025'), duration: 3, progress: 60, priority: 'Normal', approved: false },
      { taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2025'), endDate: new Date('02/12/2025'), duration: 3, progress: 100, priority: 'Critical', approved: false },
      { taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2025'), endDate: new Date('02/14/2025'), duration: 2, progress: 100, priority: 'Low', approved: true },
      { taskID: 10, taskName: 'Design complete', startDate: new Date('02/14/2025'), endDate: new Date('02/14/2025'), duration: 0, progress: 0, priority: 'Normal', approved: true }
    ]
  },
  {
    taskID: 11, taskName: 'Implementation', startDate: new Date('02/17/2025'), endDate: new Date('02/28/2025'), duration: 10, progress: 40, priority: 'Normal', approved: false,
    subtasks: [
      { taskID: 12, taskName: 'Development', startDate: new Date('02/17/2025'), endDate: new Date('02/21/2025'), duration: 5, progress: 50, priority: 'High', approved: false },
      { taskID: 13, taskName: 'Testing', startDate: new Date('02/24/2025'), endDate: new Date('02/28/2025'), duration: 5, progress: 30, priority: 'Critical', approved: false }
    ]
  }
];

/** Flat rows linked by taskID / parentID. */
export const selfReferenceData: any[] = [
  { taskID: 1, taskName: 'Parent Task 1', startDate: new Date('02/03/2025'), duration: 5, progress: 60, isParent: true },
  { taskID: 2, taskName: 'Child task 1', startDate: new Date('02/03/2025'), duration: 4, progress: 50, parentID: 1 },
  { taskID: 3, taskName: 'Child task 2', startDate: new Date('02/04/2025'), duration: 3, progress: 70, parentID: 1 },
  { taskID: 4, taskName: 'Child task 3', startDate: new Date('02/05/2025'), duration: 2, progress: 20, parentID: 1 },
  { taskID: 5, taskName: 'Parent Task 2', startDate: new Date('02/10/2025'), duration: 6, progress: 30, isParent: true },
  { taskID: 6, taskName: 'Child task 4', startDate: new Date('02/10/2025'), duration: 3, progress: 90, parentID: 5 },
  { taskID: 7, taskName: 'Child task 5', startDate: new Date('02/11/2025'), duration: 4, progress: 10, parentID: 5 },
  { taskID: 8, taskName: 'Parent Task 3', startDate: new Date('02/17/2025'), duration: 2, progress: 0, isParent: true }
];

/** Deep copy that keeps the Date values, every editable sample works on its own copy. */
export const clone = (rows: any[]): any[] => JSON.parse(JSON.stringify(rows), (k, v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v);
