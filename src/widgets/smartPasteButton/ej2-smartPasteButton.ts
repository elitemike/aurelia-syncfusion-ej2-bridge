import { SmartPasteButton, SmartPasteButtonModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("smartPasteButton")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-smart-paste-button')
export class Ej2SmartPasteButton extends SyncfusionWrapper<SmartPasteButton, SmartPasteButtonModel> {
  protected syncfusionWidgetType = SmartPasteButton;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
