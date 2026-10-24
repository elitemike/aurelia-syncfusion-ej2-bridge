import { Ruler, RulerModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("ruler")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ruler')
export class Ej2Ruler extends SyncfusionWrapper<Ruler, RulerModel> {
  protected syncfusionWidgetType = Ruler;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
