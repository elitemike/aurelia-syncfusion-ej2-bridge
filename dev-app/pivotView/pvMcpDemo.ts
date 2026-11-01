import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';
import { Ej2PivotView } from 'widgets/pivotView/ej2-pivotView';
import { viewResources } from 'aurelia-framework';

/** WebMCP: tools are registered with document.modelContext (a browser proposal, stubbed by the specs). */
@viewResources(Ej2PivotView)
export class PvMcpDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  dsr: any = createDataSourceSettings();
  webMcpSettings = { name: 'pvmcp', tools: ['addFieldToAxis', 'clearSorting'] };
}
