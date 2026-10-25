import { Sankey, SankeyModel, SankeyTooltip, SankeyLegend, SankeyExport } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let sankeyIndex = 0;

@generateBindables("sankey")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-sankey')
export class Ej2Sankey extends SyncfusionWrapper<Sankey, SankeyModel> {
  protected syncfusionWidgetType = Sankey;

  // Sankey.Inject registers modules globally and the sankey only activates the ones its options require
  // (requiredModules: tooltip, legend, export). Register all of them up front so that toggling tooltip.enable,
  // legendSettings.visible or enableExport at runtime finds them.
  protected onBeforeWidgetInstantiation() {
    Sankey.Inject(SankeyTooltip, SankeyLegend, SankeyExport);
  }

  // The sankey derives the ids of its svg elements from the host id, give every host its own.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `ej2-sankey-${++sankeyIndex}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // No placeholder handlers needed: unlike Chart, Sankey triggers all of its events unconditionally. Assigning an
    // afterExport property handler would even make Sankey.export raise afterExport twice (once from SankeyExport,
    // once more from getDataUrl).
  }

  protected onWidgetCreated() {
  }
}
