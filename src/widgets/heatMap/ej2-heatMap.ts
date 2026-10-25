import { HeatMap, HeatMapModel, Tooltip, Legend, Adaptor } from '@syncfusion/ej2-heatmap';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let heatMapIndex = 0;

@generateBindables("heatMap")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-heat-map')
export class Ej2HeatMap extends SyncfusionWrapper<HeatMap, HeatMapModel> {
  protected syncfusionWidgetType = HeatMap;

  // HeatMap.Inject registers modules globally and the heat map only activates the ones its options require
  // (requiredModules: tooltip, legend, adaptor for JSON table / cell data). Register all three up front so that
  // switching showTooltip, legendSettings.visible or the adaptor type at runtime finds them.
  protected onBeforeWidgetInstantiation() {
    HeatMap.Inject(Tooltip, Legend, Adaptor);
  }

  // The heat map derives the ids of its svg / canvas elements from the host id, give every host its own.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `ej2-heat-map-${++heatMapIndex}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // The heat map only does the work for these events (builds the cell render args, the tooltip args, the legend
    // args) when it finds a handler assigned as a property, a listener added with addEventListener, which is how
    // the bridge forwards events, does not count. Assign a placeholder, the forwarding listener then dispatches
    // the element event.
    ['cellRender', 'tooltipRender', 'legendRender'].forEach((name) => {
      this.widget[name] = () => undefined;
    });
  }

  protected onWidgetCreated() {
  }
}
