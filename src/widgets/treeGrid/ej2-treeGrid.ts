import { TreeGrid, TreeGridModel, Filter, Page, Sort, Edit, Toolbar, ColumnMenu, ContextMenu, Aggregate, ExcelExport, PdfExport, Freeze, Reorder, Resize, RowDD, Selection, VirtualScroll, DetailRow, CommandColumn, InfiniteScroll, ColumnChooser, DomVirtualization } from '@syncfusion/ej2-treegrid';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("treeGrid")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tree-grid')
export class Ej2TreeGrid extends SyncfusionWrapper<TreeGrid, TreeGridModel> {
  protected syncfusionWidgetType = TreeGrid;

  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const toolbar: any[] = Array.isArray(model.toolbar) ? model.toolbar : [];
    const toolbarHas = (...items: string[]) => toolbar.some((item) => items.indexOf(typeof item === 'string' ? item : item && item.id) !== -1);
    const columns: any[] = Array.isArray(model.columns) ? model.columns : [];
    const contextItems: any[] = Array.isArray(model.contextMenuItems) ? model.contextMenuItems : [];
    // TreeGrid.Inject registers modules globally, so every feature the model asks for has to bring its module,
    // whether it is switched on by a flag (allowSorting) or by a settings object (filterSettings).
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition) { modules.push(module); } };

    use(model.allowSelection !== false, Selection);
    use(model.allowPaging, Page);
    use(model.allowSorting || model.sortSettings, Sort);
    use(model.allowFiltering || model.filterSettings || model.searchSettings || toolbarHas('Search'), Filter);
    use(model.editSettings || toolbarHas('Add', 'Edit', 'Delete', 'Update', 'Cancel'), Edit);
    use(model.toolbar || model.toolbarTemplate, Toolbar);
    use(model.showColumnMenu, ColumnMenu);
    use(model.showColumnChooser || toolbarHas('ColumnChooser'), ColumnChooser);
    use(model.contextMenuItems, ContextMenu);
    use(model.aggregates, Aggregate);
    use(model.allowExcelExport || toolbarHas('ExcelExport', 'CsvExport'), ExcelExport);
    use(model.allowPdfExport || toolbarHas('PdfExport'), PdfExport);
    use(model.frozenColumns || model.frozenRows || columns.some((c: any) => c && c.freeze), Freeze);
    use(model.allowReordering, Reorder);
    use(model.allowResizing || contextItems.some((i: any) => i === 'AutoFit' || i === 'AutoFitAll')
      || (model.showColumnMenu && !model.columnMenuItems), Resize);
    use(model.allowRowDragAndDrop || toolbarHas('Indent', 'Outdent'), RowDD);
    use(model.enableVirtualization && !model.enableDomVirtualization, VirtualScroll);
    use(model.enableInfiniteScrolling, InfiniteScroll);
    use(model.enableDomVirtualization, DomVirtualization);
    use(model.detailTemplate, DetailRow);
    use(columns.some((c: any) => c && Array.isArray(c.commands)), CommandColumn);

    TreeGrid.Inject(...modules);
  }

  protected onWrapperCreated() {
    // print renders a clone of the tree grid that only inherits handlers assigned as properties, never the ones
    // attached with addEventListener. Assign forwarding handlers so beforePrint / printComplete reach the element.
    ["beforePrint", "printComplete"].forEach((name) => {
      this.widget[name] = (args) => this.forward(name, args);
    });
    // dataStateChange is only raised (and children only start collapsed) when a handler is assigned as a property,
    // addEventListener does not count. Assign a placeholder, but only when the page actually listens.
    ["dataStateChange", "dataSourceChanged"].forEach((name) => {
      if (this.isListening(name)) {
        this.widget[name] = () => { };
      }
    });
  }

  protected onWidgetCreated() {
    // selectedRowIndex is two-way bound, the widget only reports it through its selection events
    const report = () => { this[`${constants.bindablePrefix}selectedRowIndex`] = this.widget.selectedRowIndex; };
    this.widget.addEventListener("rowSelected", report);
    this.widget.addEventListener("rowDeselected", report);
  }

  // the tree grid only honours selectedRowIndex before the first selection exists: afterwards select explicitly
  selectedRowIndexChanged(value: number) {
    if (!this.widget || value === this.widget.selectedRowIndex) { return; }
    if (value === null || value === undefined || value < 0) {
      this.widget.clearSelection();
    } else {
      this.widget.selectRow(value);
    }
  }

  private forward(name: string, args: any) {
    const event = `${constants.eventPrefix}${name}`;
    const kebab = event.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    new Set([event, event.toLowerCase(), kebab]).forEach((eventName) => {
      this.element.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: args }));
    });
  }
  // Event handlers are bound with `e-on-<name>.delegate`, which never reaches a bindable: look for the attribute.
  private isListening(name: string) {
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const prefixes = [`${constants.eventPrefix}${kebab}.`, `${constants.eventPrefix}${name.toLowerCase()}.`];
    return Array.from(this.element.attributes).some((a) => prefixes.some((p) => a.name.toLowerCase().startsWith(p)));
  }
}
