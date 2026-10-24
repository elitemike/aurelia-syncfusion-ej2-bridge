import { SplitButton, SplitButtonModel } from '@syncfusion/ej2-splitbuttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("splitButton")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-split-button')
export class Ej2SplitButton extends SyncfusionWrapper<SplitButton, SplitButtonModel> {
  protected syncfusionWidgetType = SplitButton;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
