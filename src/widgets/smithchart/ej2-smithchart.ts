import { Smithchart, SmithchartModel, SmithchartLegend, TooltipRender } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let smithchartIds = 0;

@generateBindables("smithchart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-smithchart')
export class Ej2Smithchart extends SyncfusionWrapper<Smithchart, SmithchartModel> {
  protected syncfusionWidgetType = Smithchart;

  // legend and series tooltips are separate modules, the chart activates them from legendSettings / series.tooltip
  protected onBeforeWidgetInstantiation() {
    Smithchart.Inject(SmithchartLegend, TooltipRender);
  }

  // The chart derives its element id from a counter that restarts for every instance, so several charts on one
  // page would share an id and render into the last element. Give each host element a unique id.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `smithchart_bridge_${smithchartIds++}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
