
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { Grid, Selection, GridModel, Page, Edit, Reorder, Sort, ColumnChooser, Toolbar, Filter, Group, Aggregate, ColumnMenu, DetailRow, ContextMenu, Freeze, Resize, RowDD, Search, Print, VirtualScroll, ExcelExport, PdfExport } from '@syncfusion/ej2-grids';
import { inlineView, customElement } from "aurelia-framework"

@generateBindables("grid")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-grid')
export class Ej2Grid extends SyncfusionWrapper<Grid, GridModel> {
  onBeforeWidgetInstantiation() {
    if (this._eModel.allowPaging) {
      Grid.Inject(Page);
    }

    if (this._eModel.allowSelection) {
      Grid.Inject(Selection);
    }

    if (this._eModel.editSettings) {
      Grid.Inject(Edit);
    }

    if (this._eModel.allowReordering) {
      Grid.Inject(Reorder)
    }

    if (this._eModel.allowSorting) {
      Grid.Inject(Sort);
    }

    if (this._eModel.showColumnChooser) {
      Grid.Inject(ColumnChooser);
    }

    if (this._eModel.toolbar) {
      Grid.Inject(Toolbar);
    }

    if (this._eModel.editSettings) {
      Grid.Inject(Edit);
    }

    if (this._eModel.filterSettings) {
      Grid.Inject(Filter);
    }

    if (this._eModel.groupSettings) {
      Grid.Inject(Group);
    }

    if (this._eModel.aggregates) {
      Grid.Inject(Aggregate);
    }

    if (this._eModel.showColumnMenu) {
      Grid.Inject(ColumnMenu);
    }

    if (this._eModel.detailTemplate) {
      Grid.Inject(DetailRow);
    }

    if (this._eModel.contextMenuItems) {
      Grid.Inject(ContextMenu);
    }

    if (this._eModel.frozenColumns || this._eModel.frozenRows) {
      Grid.Inject(Freeze);
    }

    if (this._eModel.allowResizing) {
      Grid.Inject(Resize);
    }

    if (this._eModel.allowRowDragAndDrop) {
      Grid.Inject(RowDD);
    }

    if (this._eModel.searchSettings) {
      Grid.Inject(Search);
    }

    if (this._eModel.printMode) {
      Grid.Inject(Print);
    }

    if (this._eModel.enableVirtualization) {
      Grid.Inject(VirtualScroll);
    }

    if (this._eModel.allowExcelExport) {
      Grid.Inject(ExcelExport);
    }

    if (this._eModel.allowPdfExport) {
      Grid.Inject(PdfExport);
    }

  }

  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {

  }
  protected syncfusionWidgetType = Grid;

}
