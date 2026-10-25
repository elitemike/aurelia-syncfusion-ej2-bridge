import { PivotFieldList, PivotFieldListModel, CalculatedField } from '@syncfusion/ej2-pivotview';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

let nextId = 0;

@generateBindables("pivotFieldList")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pivot-field-list')
export class Ej2PivotFieldList extends SyncfusionWrapper<PivotFieldList, PivotFieldListModel> {
  protected syncfusionWidgetType = PivotFieldList;

  protected onBeforeWidgetInstantiation() {
    // the pivot controls derive the ids of their inner elements from the host id, so every instance needs its own
    let id = this.element.getAttribute("id");
    if (id) { this.element.removeAttribute("id"); } else { id = `pivotfieldlist_${nextId++}`; }
    this.widgetElement.setAttribute("id", id);
    const model: any = this._eModel;
    // Inject registers modules globally, so the model has to bring every module it switches on
    const modules: any[] = [];
    if (model.allowCalculatedField) { modules.push(CalculatedField); }
    PivotFieldList.Inject(...modules);
  }

  protected onWrapperCreated() {
    // the engine only computes the per-cell, per-header and OLAP service information behind aggregateCellInfo, onHeadersSort,
    // beforeServiceInvoke and afterServiceInvoke
    // when a handler is assigned as a property, the bridge listens with addEventListener, so assign no-ops
    ["aggregateCellInfo", "onHeadersSort", "beforeServiceInvoke", "afterServiceInvoke"].forEach((name) => {
      if (!this.widget[name]) {
        this.widget[name] = () => { };
      }
    });
  }

  // PivotFieldList.destroy never calls Component.destroy, so `destroyed` is never raised: raise it ourselves
  public detached() {
    const widget: any = this.widget;
    super.detached();
    if (widget) {
      widget.trigger('destroyed', { cancel: false });
    }
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
    // dataSourceSettings is two-way: the user changes it by dragging fields, filtering and sorting
    const report = () => {
      const settings = (<any>this.widget).dataSourceSettings;
      const key = `${constants.bindablePrefix}dataSourceSettings`;
      if (settings && this[key] !== settings) {
        this[key] = settings;
      }
    };
    report();
    this.widget.addEventListener("dataBound", report);
    this.widget.addEventListener("enginePopulated", report);
    this.widget.addEventListener("actionComplete", report);
  }
}
