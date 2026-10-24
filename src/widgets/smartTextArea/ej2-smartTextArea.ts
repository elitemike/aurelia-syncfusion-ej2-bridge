import { SmartTextArea, SmartTextAreaModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("smartTextArea")
@inlineView('<template><textarea element.ref="widgetElement"></textarea></template>')
@customElement('ej2-smart-text-area')
export class Ej2SmartTextArea extends SyncfusionWrapper<SmartTextArea, SmartTextAreaModel> {
  protected syncfusionWidgetType = SmartTextArea;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
