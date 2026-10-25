import { logEvent } from '../queryBuilder/qbLog';
import { createSheets } from './spreadsheetDemo';

/** Reduced chrome, AI assist, collaborative editing, comments and WebMCP. */
export class SsAdvancedDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = createSheets();
  aiAssistSettings = { requestUrl: '/stub/spreadsheet/ai', placeholder: 'Ask the assistant', promptSuggestions: ['Sum the sold column'] };
  webMcpSettings = { name: 'ssmcp', tools: ['getCellData', 'sheetList'] };
}
