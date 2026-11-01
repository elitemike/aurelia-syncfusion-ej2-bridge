import { logEvent } from '../queryBuilder/qbLog';
import { createSheets } from './spreadsheetDemo';
import { Ej2Spreadsheet } from 'widgets/spreadsheet/ej2-spreadsheet';
import { viewResources } from 'aurelia-framework';

/** Reduced chrome, AI assist, collaborative editing, comments and WebMCP. */
@viewResources(Ej2Spreadsheet)
export class SsAdvancedDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = createSheets();
  aiAssistSettings = { requestUrl: '/stub/spreadsheet/ai', placeholder: 'Ask the assistant', promptSuggestions: ['Sum the sold column'] };
  webMcpSettings = { name: 'ssmcp', tools: ['getCellData', 'sheetList'] };
}
