import { Gantt, GanttModel, Selection, Toolbar, Edit, Sort, Filter, DayMarkers, CriticalPath, Resize, ColumnMenu, ContextMenu, ExcelExport, PdfExport, RowDD, Reorder, VirtualScroll, UndoRedo, Freeze, WebMcpGantt } from '@syncfusion/ej2-gantt';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("gantt")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-gantt')
export class Ej2Gantt extends SyncfusionWrapper<Gantt, GanttModel> {
  protected syncfusionWidgetType = Gantt;

  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const toolbar: any[] = Array.isArray(model.toolbar) ? model.toolbar : [];
    const toolbarHas = (...items: string[]) => toolbar.some((item) => items.indexOf(typeof item === 'string' ? item : item && item.id) !== -1);
    const columns: any[] = Array.isArray(model.columns) ? model.columns : [];
    const edit: any = model.editSettings || {};
    // Gantt.Inject registers modules globally, so every feature the model asks for has to bring its module,
    // whether it is switched on by a flag (allowSorting) or by a settings object (editSettings).
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition) { modules.push(module); } };

    use(model.allowSelection !== false, Selection);
    use(model.allowSorting, Sort);
    use(model.allowFiltering || toolbarHas('Search'), Filter);
    use(model.allowReordering, Reorder);
    use(model.allowResizing, Resize);
    use(model.allowExcelExport || toolbarHas('ExcelExport', 'CsvExport'), ExcelExport);
    use(model.allowPdfExport || toolbarHas('PdfExport'), PdfExport);
    use(model.allowRowDragAndDrop, RowDD);
    use(model.enableCriticalPath || toolbarHas('CriticalPath'), CriticalPath);
    use(model.enableUndoRedo || toolbarHas('Undo', 'Redo'), UndoRedo);
    use(model.toolbar && model.toolbar.length, Toolbar);
    use(edit.allowAdding || edit.allowEditing || edit.allowDeleting || edit.allowTaskbarEditing, Edit);
    use(model.highlightWeekends || (model.holidays && model.holidays.length) || (model.eventMarkers && model.eventMarkers.length), DayMarkers);
    use(model.enableContextMenu, ContextMenu);
    use(model.showColumnMenu, ColumnMenu);
    use(model.enableVirtualization, VirtualScroll);
    use(model.frozenColumns || columns.some((c: any) => c && c.freeze), Freeze);
    use(model.enableWebMcp, WebMcpGantt);

    Gantt.Inject(...modules);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // selectedRowIndex is two-way bound, the widget only reports it through its selection events
    const report = () => { this[`${constants.bindablePrefix}selectedRowIndex`] = this.widget.selectedRowIndex; };
    this.widget.addEventListener("rowSelected", report);
    this.widget.addEventListener("rowDeselected", report);
  }

  // the gantt only honours selectedRowIndex before the first selection exists: afterwards select explicitly
  selectedRowIndexChanged(value: number) {
    if (!this.widget || value === this.widget.selectedRowIndex) { return; }
    if (value === null || value === undefined || value < 0) {
      this.widget.clearSelection();
    } else {
      this.widget.selectRow(value);
    }
  }
}
