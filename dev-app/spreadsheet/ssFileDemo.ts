import { logEvent } from '../queryBuilder/qbLog';
import { createSheets } from './spreadsheetDemo';

/** Open and save go through a hosted service (openUrl / saveUrl); the specs stub both. */
export class SsFileDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = createSheets();
  openSettings = { importOptions: { ignoreStyle: false } };
  openUrl = '/stub/spreadsheet/open';
  saveUrl = '/stub/spreadsheet/save';
}
