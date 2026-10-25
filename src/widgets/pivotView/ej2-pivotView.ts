import {
  PivotView, PivotViewModel, GroupingBar, FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport,
  ConditionalFormatting, NumberFormatting, VirtualScroll, DrillThrough, Pager, Grouping
} from '@syncfusion/ej2-pivotview';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

let nextId = 0;

@generateBindables("pivotView")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pivot-view')
export class Ej2PivotView extends SyncfusionWrapper<PivotView, PivotViewModel> {
  protected syncfusionWidgetType = PivotView;

  protected onBeforeWidgetInstantiation() {
    // the pivot controls derive the ids of their inner elements from the host id, so every instance needs its own
    let id = this.element.getAttribute("id");
    if (id) { this.element.removeAttribute("id"); } else { id = `pivotview_${nextId++}`; }
    this.widgetElement.setAttribute("id", id);
    const model: any = this._eModel;
    const toolbar: any[] = Array.isArray(model.toolbar) ? model.toolbar : [];
    // PivotView.Inject registers modules globally, so every feature the model switches on has to bring its module
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition) { modules.push(module); } };

    use(model.showGroupingBar, GroupingBar);
    use(model.showFieldList, FieldList);
    use(model.allowCalculatedField, CalculatedField);
    use(model.showToolbar && (toolbar.length || model.toolbarTemplate), Toolbar);
    use(model.allowConditionalFormatting, ConditionalFormatting);
    use(model.allowNumberFormatting, NumberFormatting);
    use(model.allowExcelExport, ExcelExport);
    use(model.allowPdfExport, PDFExport);
    use(model.enableVirtualization, VirtualScroll);
    use(model.allowGrouping, Grouping);
    use(model.allowDrillThrough || (model.editSettings && model.editSettings.allowEditing), DrillThrough);
    use(model.enablePaging, Pager);

    PivotView.Inject(...modules);

    // the pivot grid only hands these events to its inner grid when a handler is configured in gridSettings, and
    // never raises them on the PivotView itself, so configure forwarding handlers that raise the PivotView events
    const gridSettings: any = Object.assign({}, model.gridSettings);
    ["columnDragStart", "columnDrag", "columnDrop"].forEach((name) => {
      const own = gridSettings[name];
      let raising = false;
      gridSettings[name] = (args) => {
        // trigger calls the handler configured on the widget, which is this one: guard against recursion
        if (!raising && this.widget) {
          raising = true;
          try { (<any>this.widget).trigger(name, args); } finally { raising = false; }
        }
        if (typeof own === 'function') { own.call(this.widget, args); }
      };
    });
    model.gridSettings = gridSettings;
  }

  protected onWrapperCreated() {
    // the engine only computes the per-cell, per-header and OLAP service information behind aggregateCellInfo, onHeadersSort, cellClick,
    // beforeServiceInvoke and afterServiceInvoke
    // when a handler is assigned as a property, the bridge listens with addEventListener, so assign no-ops
    ["aggregateCellInfo", "onHeadersSort", "beforeServiceInvoke", "afterServiceInvoke", "cellClick"].forEach((name) => {
      if (!this.widget[name]) {
        this.widget[name] = () => { };
      }
    });
  }

  protected dataSourceSettingsChanged(value: any) {
    const widget: any = this.widget;
    if (!widget || !value || value === widget.dataSourceSettings) { return; }
    // the widget only repopulates its engine when the data source itself changes, so hand it a copy of an array source
    const next = Object.assign({}, value);
    if (Array.isArray(next.dataSource)) { next.dataSource = next.dataSource.slice(); }
    widget.dataSourceSettings = next;
  }

  protected onWidgetCreated() {
    // dataSourceSettings is two-way: field list, grouping bar, filters and sorting all change it
    const report = () => {
      const settings = (<any>this.widget).dataSourceSettings;
      const key = `${constants.bindablePrefix}dataSourceSettings`;
      if (settings && this[key] !== settings) {
        this[key] = settings;
      }
    };
    // pivotValues is a from-view binding: report the engine output after every data bind
    const reportValues = () => { this[`${constants.bindablePrefix}pivotValues`] = (<any>this.widget).pivotValues; };
    reportValues();
    this.widget.addEventListener("dataBound", () => { report(); reportValues(); });
    this.widget.addEventListener("enginePopulated", report);
    this.widget.addEventListener("actionComplete", report);
  }
}
