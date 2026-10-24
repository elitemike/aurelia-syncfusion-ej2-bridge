import { HeatMap, HeatMapModel } from '@syncfusion/ej2-heatmap';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("heatMap")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-heat-map')
export class Ej2HeatMap extends SyncfusionWrapper<HeatMap, HeatMapModel> {
  protected syncfusionWidgetType = HeatMap;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
