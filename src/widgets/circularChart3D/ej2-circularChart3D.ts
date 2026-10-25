import {
  CircularChart3D, CircularChart3DModel, PieSeries3D, CircularChartDataLabel3D, CircularChartLegend3D, CircularChartTooltip3D,
  CircularChartSelection3D, CircularChartHighlight3D, CircularChartExport3D
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let circularChart3DIds = 0;

const unhandledProperties = ['theme', 'backgroundImage', 'useGroupingSeparator'];

@generateBindables("circularChart3D")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-circular-chart3d')
export class Ej2CircularChart3D extends SyncfusionWrapper<CircularChart3D, CircularChart3DModel> {
  protected syncfusionWidgetType = CircularChart3D;

  protected onBeforeWidgetInstantiation() {
    CircularChart3D.Inject(PieSeries3D, CircularChartDataLabel3D, CircularChartLegend3D, CircularChartTooltip3D,
      CircularChartSelection3D, CircularChartHighlight3D, CircularChartExport3D);
  }

  // unique host id per instance, the chart's own id counter restarts for every instance
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `circularChart3D_bridge_${circularChart3DIds++}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // CircularChart3D. onPropertyChanged ignores these after the first render: update the property silently and refresh.
    unhandledProperties.forEach((name) => {
      this[`${name}Changed`] = (value: any) => {
        if (!this.widget) { return; }
        (<any>this.widget).setProperties({ [name]: value }, true);
        this.widget.refresh();
      };
    });
    // pointClick / pointMove / afterExport are only raised when a handler is assigned as a property
    ['pointClick', 'pointMove', 'afterExport'].forEach((name) => {
      this.widget[name] = () => undefined;
    });
  }

  protected onWidgetCreated() {
  }
}
