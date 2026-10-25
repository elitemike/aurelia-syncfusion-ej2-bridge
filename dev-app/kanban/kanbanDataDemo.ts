import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { kanbanData, statusColumns, cardSettings, clone } from './kanbanData';
import { logEvent } from './kanbanLog';

/** Data handling: a query, an app owned { result, count } source and a failing remote source. */
export class KanbanDataDemo {
  log = logEvent;
  columns = statusColumns;
  cardSettings = cardSettings;

  // query
  queryData = new DataManager(clone(kanbanData) as any);
  query = new Query().where('Priority', 'equal', 'Critical');

  // custom data binding
  stateAll = clone(kanbanData);
  stateSource: any = { result: this.stateAll, count: this.stateAll.length };
  stateLast = '';
  stateChanged = '';

  // a remote source that answers with something that is not JSON
  showFailing = false;
  failingSource = new DataManager({ url: '/kb-missing', adaptor: new UrlAdaptor() });

  onDataStateChange(event: CustomEvent) {
    logEvent('dataStateChange', event);
    const action = event.detail.action;
    this.stateLast = action ? action.requestType : 'init';
    this.stateSource = { result: this.stateAll, count: this.stateAll.length };
  }

  onDataSourceChanged(event: CustomEvent) {
    logEvent('dataSourceChanged', event);
    const args: any = event.detail;
    this.stateChanged = args.requestType;
    args.endEdit();
  }
}
