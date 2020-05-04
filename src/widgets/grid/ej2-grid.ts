
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { Grid, Selection, GridModel, Page, Edit, Reorder, Sort, ColumnChooser, Toolbar, Filter, Group, Aggregate, ColumnMenu, DetailRow, ContextMenu, Freeze, Resize, RowDD, Search, Print, VirtualScroll, ExcelExport, PdfExport } from '@syncfusion/ej2-grids';
import { inlineView, customElement } from "aurelia-framework"

@generateBindables("grid")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-grid')
export class Ej2Grid extends SyncfusionWrapper<Grid, GridModel> {
  onBeforeWidgetInstantiation() {
    if (this.eModel.allowPaging) {
      Grid.Inject(Page);
    }

    if (this.eModel.allowSelection) {
      Grid.Inject(Selection);
    }

    if (this.eModel.editSettings) {
      Grid.Inject(Edit);
    }

    if (this.eModel.allowReordering) {
      Grid.Inject(Reorder)
    }

    if (this.eModel.allowSorting) {
      Grid.Inject(Sort);
    }

    if (this.eModel.showColumnChooser) {
      Grid.Inject(ColumnChooser);
    }

    if (this.eModel.toolbar) {
      Grid.Inject(Toolbar);
    }

    if (this.eModel.editSettings) {
      Grid.Inject(Edit);
    }

    if (this.eModel.filterSettings) {
      Grid.Inject(Filter);
    }

    if (this.eModel.groupSettings) {
      Grid.Inject(Group);
    }

    if (this.eModel.aggregates) {
      Grid.Inject(Aggregate);
    }

    if (this.eModel.showColumnMenu) {
      Grid.Inject(ColumnMenu);
    }

    if (this.eModel.detailTemplate) {
      Grid.Inject(DetailRow);
    }

    if (this.eModel.contextMenuItems) {
      Grid.Inject(ContextMenu);
    }

    if (this.eModel.frozenColumns || this.eModel.frozenRows) {
      Grid.Inject(Freeze);
    }

    if (this.eModel.allowResizing) {
      Grid.Inject(Resize);
    }

    if (this.eModel.allowRowDragAndDrop) {
      Grid.Inject(RowDD);
    }

    if (this.eModel.searchSettings) {
      Grid.Inject(Search);
    }

    if (this.eModel.printMode) {
      Grid.Inject(Print);
    }

    if (this.eModel.enableVirtualization) {
      Grid.Inject(VirtualScroll);
    }

    if (this.eModel.allowExcelExport) {
      Grid.Inject(ExcelExport);
    }

    if (this.eModel.allowPdfExport) {
      Grid.Inject(PdfExport);
    }

  }

  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {

  }
  protected syncfusionWidgetType = Grid;

}
