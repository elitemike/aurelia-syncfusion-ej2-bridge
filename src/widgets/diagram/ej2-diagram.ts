import { Diagram, DiagramModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("diagram")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-diagram')
export class Ej2Diagram extends SyncfusionWrapper<Diagram, DiagramModel> {
  protected syncfusionWidgetType = Diagram;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
