import { hierarchicalData, clone } from './treeGridData';
import { logEvent } from './treeGridLog';

export class TreeGridEditDemo {
  log = logEvent;
  columns = [
    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right', isPrimaryKey: true, validationRules: { required: true, number: true } },
    { field: 'taskName', headerText: 'Task Name', width: 220, validationRules: { required: true } },
    { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right', editType: 'numericedit' },
    { field: 'progress', headerText: 'Progress', width: 100, textAlign: 'Right', editType: 'numericedit' }
  ];
  toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'];

  normalData = clone(hierarchicalData);
  normalSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Child' };

  cellData = clone(hierarchicalData);
  cellSettings = { allowEditing: true, mode: 'Cell' };

  batchData = clone(hierarchicalData);
  batchSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' };

  checkData = clone(hierarchicalData);
  checkColumns = [
    { field: 'taskName', headerText: 'Task Name', width: 220, showCheckbox: true },
    { field: 'duration', headerText: 'Duration', width: 100 }
  ];

  lastAction = '';
  onActionComplete(event: CustomEvent) {
    this.lastAction = event.detail.requestType;
    logEvent('actionComplete', event);
  }
}
