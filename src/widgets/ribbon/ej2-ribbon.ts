import { Ribbon, RibbonModel } from '@syncfusion/ej2-ribbon';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("ribbon")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ribbon')
export class Ej2Ribbon extends SyncfusionWrapper<Ribbon, RibbonModel> {
  protected syncfusionWidgetType = Ribbon;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
