import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("dialog")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-dialog')
export class Ej2Dialog extends SyncfusionWrapper<Dialog, DialogModel> {
  protected syncfusionWidgetType = Dialog;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
