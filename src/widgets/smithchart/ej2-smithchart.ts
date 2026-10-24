import { Smithchart, SmithchartModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("smithchart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-smithchart')
export class Ej2Smithchart extends SyncfusionWrapper<Smithchart, SmithchartModel> {
  protected syncfusionWidgetType = Smithchart;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
