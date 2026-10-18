
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { Grid, Selection, GridModel, Page, Edit, Reorder, Sort, ColumnChooser, Toolbar, Filter, Group, Aggregate, ColumnMenu, DetailRow, ContextMenu, Freeze, Resize, RowDD, Search, Print, VirtualScroll, InfiniteScroll, ExcelExport, PdfExport } from '@syncfusion/ej2-grids';
import { inlineView, customElement } from "aurelia-framework"
import { constants } from '../../common/constants';

@generateBindables("grid")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-grid')
export class Ej2Grid extends SyncfusionWrapper<Grid, GridModel> {
  onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const toolbar: any[] = Array.isArray(model.toolbar) ? model.toolbar : [];
    const toolbarHas = (...items: string[]) => toolbar.some((item) => items.indexOf(typeof item === 'string' ? item : item && item.id) !== -1);
    // Grid.Inject registers modules globally, so every feature the model asks for has to bring its module,
    // whether it is switched on by a flag (allowFiltering) or by a settings object (filterSettings).
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition) { modules.push(module); } };

    use(model.allowPaging, Page);
    use(model.allowSelection, Selection);
    use(model.editSettings, Edit);
    use(model.allowReordering, Reorder);
    use(model.allowSorting, Sort);
    use(model.showColumnChooser || toolbarHas('ColumnChooser'), ColumnChooser);
    use(model.toolbar || model.toolbarTemplate, Toolbar);
    use(model.allowFiltering || model.filterSettings, Filter);
    use(model.allowGrouping || model.groupSettings, Group);
    use(model.aggregates, Aggregate);
    use(model.showColumnMenu, ColumnMenu);
    use(model.detailTemplate || model.childGrid, DetailRow);
    use(model.contextMenuItems, ContextMenu);
    use(model.frozenColumns || model.frozenRows, Freeze);
    use(model.allowResizing, Resize);
    use(model.allowRowDragAndDrop, RowDD);
    use(model.searchSettings || toolbarHas('Search'), Search);
    use(model.printMode || toolbarHas('Print'), Print);
    use(model.enableVirtualization, VirtualScroll);
    use(model.enableInfiniteScrolling, InfiniteScroll);
    use(model.allowExcelExport || toolbarHas('ExcelExport', 'CsvExport'), ExcelExport);
    use(model.allowPdfExport || toolbarHas('PdfExport'), PdfExport);

    Grid.Inject(...modules);
  }

  protected onWidgetCreated() {
    // selectedRowIndex is two-way bound, the widget only reports it through its selection events
    this.widget.addEventListener("rowSelected", () => {
      this[`${constants.bindablePrefix}selectedRowIndex`] = this.widget.selectedRowIndex;
    });
    this.widget.addEventListener("rowDeselected", () => {
      this[`${constants.bindablePrefix}selectedRowIndex`] = this.widget.selectedRowIndex;
    });
  }
  protected onWrapperCreated() {

  }
  protected syncfusionWidgetType = Grid;

}
