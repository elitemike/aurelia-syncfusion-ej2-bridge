import { Ruler, RulerModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { refreshOnPropertyChange } from '../visualizationHelpers';
import { moveIdToHost } from '../diagramHelpers';

@generateBindables("ruler")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ruler')
export class Ej2Ruler extends SyncfusionWrapper<Ruler, RulerModel> {
  protected syncfusionWidgetType = Ruler;

  protected appendWidget() {
    moveIdToHost(this.element, this.widgetElement, 'ruler');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the ruler draws its ticks once, a changed property only shows after a re-render
    refreshOnPropertyChange(this, this.widget, []);
  }

  protected onWidgetCreated() {
  }
}
