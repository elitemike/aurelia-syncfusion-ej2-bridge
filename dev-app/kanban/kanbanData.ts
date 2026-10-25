/** Local data for the Kanban demos, modelled on the Syncfusion "Default functionalities" sample. */
export const kanbanData: any[] = [
  { Id: 'Task 1', Title: 'Analyze the new requirements', Status: 'Open', Summary: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Low', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1, Color: '#02897B' },
  { Id: 'Task 2', Title: 'Improve application performance', Status: 'InProgress', Summary: 'Improve app performance', Type: 'Improvement', Priority: 'Normal', Tags: 'Improvement', Estimate: 6, Assignee: 'Andrew Fuller', RankId: 1, Color: '#673AB8' },
  { Id: 'Task 3', Title: 'Arrange a web meeting with the customer', Status: 'Open', Summary: 'Arrange a web meeting with the customer to get the login page requirements.', Type: 'Others', Priority: 'Critical', Tags: 'Meeting', Estimate: 5.5, Assignee: 'Janet Leverling', RankId: 2, Color: '#1F88E5' },
  { Id: 'Task 4', Title: 'Fix the issues reported in the IE browser', Status: 'Testing', Summary: 'Fix the issues reported by the customer.', Type: 'Bug', Priority: 'Critical', Tags: 'IE', Estimate: 2.5, Assignee: 'Nancy Davloio', RankId: 1, Color: '#E64A19' },
  { Id: 'Task 5', Title: 'Fix the issues reported by the customer', Status: 'Done', Summary: 'Fix the issues reported by the customer.', Type: 'Bug', Priority: 'Low', Tags: 'Customer', Estimate: 3.5, Assignee: 'Andrew Fuller', RankId: 1, Color: '#E64A19' },
  { Id: 'Task 6', Title: 'Validate new requirements', Status: 'InProgress', Summary: 'Validate the new requirements.', Type: 'Story', Priority: 'High', Tags: 'Validation', Estimate: 4, Assignee: 'Janet Leverling', RankId: 2, Color: '#02897B' },
  { Id: 'Task 7', Title: 'Show the retrieved data from the server', Status: 'Testing', Summary: 'Show the retrieved data from the server in the grid.', Type: 'Story', Priority: 'Normal', Tags: 'Grid', Estimate: 1.5, Assignee: 'Nancy Davloio', RankId: 2, Color: '#02897B' },
  { Id: 'Task 8', Title: 'Publish the release notes', Status: 'Done', Summary: 'Publish the release notes.', Type: 'Others', Priority: 'Low', Tags: 'Release', Estimate: 1, Assignee: 'Janet Leverling', RankId: 2, Color: '#1F88E5' }
];

export const clone = (rows: any[]): any[] => rows.map(r => ({ ...r }));

export const statusColumns = [
  { headerText: 'To Do', keyField: 'Open', allowToggle: true },
  { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
  { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
  { headerText: 'Done', keyField: 'Done', allowToggle: true }
];

export const cardSettings = { headerField: 'Id', contentField: 'Summary', tagsField: 'Tags', grabberField: 'Color', showHeader: true };
