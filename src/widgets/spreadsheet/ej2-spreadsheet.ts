import { Spreadsheet, SpreadsheetModel } from '@syncfusion/ej2-spreadsheet';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("spreadsheet")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-spreadsheet')
export class Ej2Spreadsheet extends SyncfusionWrapper<Spreadsheet, SpreadsheetModel> {
  protected syncfusionWidgetType = Spreadsheet;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
