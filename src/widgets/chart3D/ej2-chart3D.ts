import {
  Chart3D, Chart3DModel, ColumnSeries3D, BarSeries3D, StackingColumnSeries3D, StackingBarSeries3D, DataLabel3D, Category3D,
  DateTime3D, DateTimeCategory3D, Logarithmic3D, Legend3D, Tooltip3D, Selection3D, Highlight3D, Export3D
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let chart3DIds = 0;

const unhandledProperties = ['theme', 'palettes', 'margin', 'backgroundImage', 'wallColor', 'isTransposed', 'rows', 'columns', 'useGroupingSeparator'];

@generateBindables("chart3D")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chart3d')
export class Ej2Chart3D extends SyncfusionWrapper<Chart3D, Chart3DModel> {
  protected syncfusionWidgetType = Chart3D;

  // Chart3D.Inject registers modules globally, the chart activates only what its options need (series types, axis
  // value types, tooltip, legend, selection, highlight, export, data labels), so register all of them up front.
  protected onBeforeWidgetInstantiation() {
    Chart3D.Inject(ColumnSeries3D, BarSeries3D, StackingColumnSeries3D, StackingBarSeries3D, DataLabel3D, Category3D, DateTime3D,
      DateTimeCategory3D, Logarithmic3D, Legend3D, Tooltip3D, Selection3D, Highlight3D, Export3D);
  }

  // unique host id per instance, the chart's own id counter restarts for every instance
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `chart3D_bridge_${chart3DIds++}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // Chart3D. onPropertyChanged ignores these after the first render: update the property silently and refresh.
    unhandledProperties.forEach((name) => {
      this[`${name}Changed`] = (value: any) => {
        if (!this.widget) { return; }
        (<any>this.widget).setProperties({ [name]: value }, true);
        this.widget.refresh();
      };
    });
    // The chart only raises these when a handler is assigned as a property (`if (this.pointClick)`), the bridge
    // listens with addEventListener, so assign no-op placeholders; the forwarding listener then dispatches the event.
    ['pointClick', 'pointMove', 'afterExport'].forEach((name) => {
      this.widget[name] = () => undefined;
    });
  }

  protected onWidgetCreated() {
  }
}
