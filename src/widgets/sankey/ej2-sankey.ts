import { Sankey, SankeyModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("sankey")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-sankey')
export class Ej2Sankey extends SyncfusionWrapper<Sankey, SankeyModel> {
  protected syncfusionWidgetType = Sankey;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
