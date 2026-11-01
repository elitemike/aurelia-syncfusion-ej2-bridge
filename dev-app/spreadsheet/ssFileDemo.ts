import { logEvent } from '../queryBuilder/qbLog';
import { createSheets } from './spreadsheetDemo';
import { Ej2Spreadsheet } from 'widgets/spreadsheet/ej2-spreadsheet';
import { viewResources } from 'aurelia-framework';

/** Open and save go through a hosted service (openUrl / saveUrl); the specs stub both. */
@viewResources(Ej2Spreadsheet)
export class SsFileDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = createSheets();
  openSettings = { importOptions: { ignoreStyle: false } };
  openUrl = '/stub/spreadsheet/open';
  saveUrl = '/stub/spreadsheet/save';
}
