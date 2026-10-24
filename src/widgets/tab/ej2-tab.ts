import { Tab, TabModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("tab")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tab')
export class Ej2Tab extends SyncfusionWrapper<Tab, TabModel> {
  protected syncfusionWidgetType = Tab;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
