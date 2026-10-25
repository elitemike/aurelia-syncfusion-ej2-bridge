import { Spreadsheet, SpreadsheetModel, AIAssist, WebMcpSpreadsheet, CollaborativeEditingHandler } from '@syncfusion/ej2-spreadsheet';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

let nextId = 0;

@generateBindables("spreadsheet")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-spreadsheet')
export class Ej2Spreadsheet extends SyncfusionWrapper<Spreadsheet, SpreadsheetModel> {
  protected syncfusionWidgetType = Spreadsheet;

  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    // the spreadsheet derives element ids (ribbon, sheet tabs, dialogs) from the host id, so every instance needs its own
    let id = this.element.getAttribute("id");
    if (id) { this.element.removeAttribute("id"); } else { id = `spreadsheet_${nextId++}`; }
    this.widgetElement.setAttribute("id", id);

    // Inject registers modules globally: the core modules are injected by the package, these three are opt-in
    const modules: any[] = [];
    if (model.enableAIAssist) { modules.push(AIAssist); }
    if (model.enableWebMcp) { modules.push(WebMcpSpreadsheet); }
    if (model.enableCollaborativeEditing) { modules.push(CollaborativeEditingHandler); }
    Spreadsheet.Inject(...modules);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // activeSheetIndex is two-way: the sheet tabs change it
    const widget: any = this.widget;
    const key = (name: string) => `${constants.bindablePrefix}${name}`;
    const report = () => {
      if (!this.widget) { return; }
      if (this[key('activeSheetIndex')] !== widget.activeSheetIndex) { this[key('activeSheetIndex')] = widget.activeSheetIndex; }
    };
    report();
    // the generic event bridge never reaches the host for `destroyed` on this control (the widget raises it while it
    // tears down), forward it here unless the bridge already did
    const eventName = `${constants.eventPrefix}destroyed`;
    let forwarded = false;
    const mark = () => { forwarded = true; };
    this.element.addEventListener(eventName, mark);
    widget.addEventListener("destroyed", (args) => {
      if (!forwarded) {
        new Set([eventName, eventName.toLowerCase()]).forEach((name) => {
          this.element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: args }));
        });
      }
      this.element.removeEventListener(eventName, mark);
    });
    ["actionComplete", "dataBound", "openComplete", "sortComplete"].forEach((name) => widget.addEventListener(name, report));
  }
}
