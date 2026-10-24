
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { Grid, Selection, GridModel, Page, Edit, Reorder, Sort, ColumnChooser, Toolbar, Filter, Group, Aggregate, ColumnMenu, DetailRow, ContextMenu, Freeze, Resize, RowDD, Search, Print, VirtualScroll, InfiniteScroll, ExcelExport, PdfExport, AdvancedFilter, DomVirtualization, CommandColumn, LazyLoadGroup, ForeignKey, Formula, WebMcpGrid } from '@syncfusion/ej2-grids';
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
    use(model.enableVirtualization || model.enableColumnVirtualization, VirtualScroll);
    use(model.enableInfiniteScrolling, InfiniteScroll);
    use(model.allowExcelExport || toolbarHas('ExcelExport', 'CsvExport'), ExcelExport);
    use(model.allowPdfExport || toolbarHas('PdfExport'), PdfExport);

    use(model.allowAdvancedFiltering, Filter);
    use(model.allowAdvancedFiltering, AdvancedFilter);
    use(model.enableDomVirtualization, DomVirtualization);
    use(Array.isArray(model.columns) && model.columns.some((column: any) => column && Array.isArray(column.commands)), CommandColumn);
    use(model.groupSettings && model.groupSettings.enableLazyLoading, LazyLoadGroup);
    use(Array.isArray(model.columns) && model.columns.some((column: any) => column && column.foreignKeyValue), ForeignKey);
    use(Array.isArray(model.columns) && model.columns.some((column: any) => column && column.allowFormula), Formula);
    use(model.enableWebMcp, WebMcpGrid);

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
    // currentViewData is a from-view binding: report the rows on screen after every data bind
    this.widget.addEventListener("dataBound", () => {
      this[`${constants.bindablePrefix}currentViewData`] = this.widget.currentViewData;
    });
  }
  protected onWrapperCreated() {
    // print renders a clone of the grid that only inherits event handlers assigned as properties, never the
    // ones attached with addEventListener, and raises beforePrint / printComplete on that clone. Assign
    // forwarding handlers so those two reach the element like every other event.
    ["beforePrint", "printComplete"].forEach((name) => {
      this.widget[name] = (args) => {
        const event = `${constants.eventPrefix}${name}`;
        const kebab = event.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        new Set([event, event.toLowerCase(), kebab]).forEach((eventName) => {
          this.element.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: args }));
        });
      };
    });
  }
  protected syncfusionWidgetType = Grid;

}
