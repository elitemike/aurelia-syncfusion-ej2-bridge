import { kanbanData, statusColumns, cardSettings, clone } from './kanbanData';
import { logEvent } from './kanbanLog';

/** Drag and drop, swimlanes, stacked headers, dialog, tooltip, templates, virtualization and external drop. */
export class KanbanBoardDemo {
  log = logEvent;
  columns = statusColumns;
  cardSettings = cardSettings;

  // drag and drop
  dragData = clone(kanbanData);
  constraintType = 'Swimlane';

  // swimlanes, stacked headers, empty columns
  swimData = clone(kanbanData);
  swimlaneSettings = { keyField: 'Assignee', textField: 'Assignee', showEmptyRow: true, showItemCount: true, allowDragAndDrop: true };
  stackedHeaders = [{ text: 'Planning', keyFields: 'Open,InProgress' }, { text: 'Delivery', keyFields: 'Testing,Done' }];
  swimColumns = [...statusColumns, { headerText: 'Archived', keyField: 'Archived', allowToggle: true }];

  // dialog
  dialogData = clone(kanbanData);
  dialogSettings = {
    fields: [
      { text: 'ID', key: 'Id', type: 'TextBox' },
      { key: 'Status', type: 'DropDown' },
      { key: 'Estimate', type: 'Numeric' },
      { key: 'Summary', type: 'TextArea' }
    ]
  };

  // tooltip and templates
  tipData = clone(kanbanData);
  tooltipTemplate = '<div class="kb-tooltip-template">${Title}</div>';
  templateCard = {
    headerField: 'Id', contentField: 'Summary', showHeader: true,
    template: '<div class="kb-card-template">${Id}: ${Title}</div>'
  };

  // virtualization
  bigData = (() => {
    const states = ['Open', 'InProgress', 'Testing', 'Done'];
    const rows: any[] = [];
    for (let i = 1; i <= 300; i++) {
      rows.push({ Id: 'Item ' + i, Title: 'Item ' + i, Status: states[i % 4], Summary: 'Summary ' + i, RankId: i });
    }
    return rows;
  })();

  // external drop
  externalData = clone(kanbanData);
  externalHost = false;
}
