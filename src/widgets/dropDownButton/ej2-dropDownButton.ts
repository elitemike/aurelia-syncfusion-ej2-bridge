import { DropDownButton, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("dropDownButton")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-drop-down-button')
export class Ej2DropDownButton extends SyncfusionWrapper<DropDownButton, DropDownButtonModel> {
  protected syncfusionWidgetType = DropDownButton;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
