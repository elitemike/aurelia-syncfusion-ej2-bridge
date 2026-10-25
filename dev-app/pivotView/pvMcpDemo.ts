import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';

/** WebMCP: tools are registered with document.modelContext (a browser proposal, stubbed by the specs). */
export class PvMcpDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  dsr: any = createDataSourceSettings();
  webMcpSettings = { name: 'pvmcp', tools: ['addFieldToAxis', 'clearSorting'] };
}
