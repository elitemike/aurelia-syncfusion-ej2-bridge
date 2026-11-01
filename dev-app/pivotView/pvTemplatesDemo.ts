import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';
import { Ej2PivotView } from 'widgets/pivotView/ej2-pivotView';
import { viewResources } from 'aurelia-framework';

/** Templates, hyperlinks, context menu and grouping (Syncfusion "Cell template", "Hyperlink", "Context menu" and "Grouping" samples). */
@viewResources(Ej2PivotView)
export class PvTemplatesDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);

  // templates
  templateDsr: any = createDataSourceSettings();
  cellTemplate = '<div class="pv-cell-tpl">${cellInfo.formattedText}</div>';
  tooltipTemplate = '<div class="pv-tooltip-tpl">${value} units</div>';
  spinnerTemplate = '<div class="pv-spinner-tpl">Loading...</div>';
  toolbarTemplate = '#pv-toolbar-template';

  // hyperlinks
  linkDsr: any = createDataSourceSettings();
  hyperlinkSettings = {
    showHyperlink: true, showRowHeaderHyperlink: true, showColumnHeaderHyperlink: false, showValueCellHyperlink: true,
    showSummaryCellHyperlink: false, headerText: 'Country'
  };
  lastLink = '';
  onLinkClick(e: CustomEvent) { this.lastLink = e.detail.currentCell && e.detail.currentCell.textContent; this.log('pvx.hyperlinkCellClick', e); }

  // context menu
  menuDsr: any = createDataSourceSettings();
  menuGridSettings = { contextMenuItems: ['Aggregate', 'Drillthrough', 'Expand', 'Collapse'], columnWidth: 120 };

  // grouping
  groupDsr: any = createDataSourceSettings({
    rows: [{ name: 'Sold' }], columns: [{ name: 'Year' }], values: [{ name: 'Amount' }],
    groupSettings: [{ name: 'Sold', type: 'Number', rangeInterval: 10, startingAt: 0, endingAt: 40 }], expandAll: true
  });
}
