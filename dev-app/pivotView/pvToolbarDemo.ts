import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';
import { Ej2PivotView } from 'widgets/pivotView/ej2-pivotView';
import { viewResources } from 'aurelia-framework';

/** Report management, export, formatting and print from the toolbar (Syncfusion "Toolbar" and "Export" samples). */
@viewResources(Ej2PivotView)
export class PvToolbarDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  dsr: any = createDataSourceSettings();
  toolbar = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal',
    'ConditionalFormatting', 'NumberFormatting', 'FieldList'];

  // reports live in memory, the Syncfusion sample keeps them in localStorage
  reports: { reportName: string; report: string }[] = [{ reportName: 'Sample Report', report: '' }];
  fetchReport(e: CustomEvent) {
    e.detail.reportName = this.reports.map((r) => r.reportName);
    this.log('pvt.fetchReport', e);
  }
  saveReport(e: CustomEvent) {
    const found = this.reports.find((r) => r.reportName === e.detail.reportName);
    if (found) { found.report = e.detail.report; } else { this.reports.push({ reportName: e.detail.reportName, report: e.detail.report }); }
    this.log('pvt.saveReport', e);
  }
  loadReport(e: CustomEvent) {
    const found = this.reports.find((r) => r.reportName === e.detail.reportName);
    const widget = (e.target as any).au['ej2-pivot-view'].viewModel.widget;
    if (found && found.report) { widget.loadPersistData(found.report); }
    this.log('pvt.loadReport', e);
  }
  renameReport(e: CustomEvent) {
    const found = this.reports.find((r) => r.reportName === e.detail.reportName);
    if (found) { found.reportName = e.detail.rename; }
    this.log('pvt.renameReport', e);
  }
  removeReport(e: CustomEvent) {
    this.reports = this.reports.filter((r) => r.reportName !== e.detail.reportName);
    this.log('pvt.removeReport', e);
  }
}
