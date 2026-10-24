import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("popup")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-popup')
export class Ej2Popup extends SyncfusionWrapper<Popup, PopupModel> {
  protected syncfusionWidgetType = Popup;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
