import { BulletChart, BulletChartModel, BulletTooltip, BulletChartLegend } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let bulletChartIds = 0;

const unhandledProperties = [
  'orientation', 'labelFormat', 'minorTicksPerInterval', 'labelStyle', 'categoryLabelStyle', 'tooltip', 'legendSettings',
  'dataLabel', 'margin', 'targetWidth', 'valueHeight', 'valueBorder', 'targetTypes', 'categoryField', 'valueField',
  'theme', 'border', 'targetField', 'enableGroupSeparator', 'animation', 'tabIndex', 'query'
];

@generateBindables("bulletChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-bullet-chart')
export class Ej2BulletChart extends SyncfusionWrapper<BulletChart, BulletChartModel> {
  protected syncfusionWidgetType = BulletChart;

  // Inject registers the modules globally, the chart only activates the ones its options require (tooltip.enable,
  // legendSettings.visible), so they can safely be registered up front, also for options that change later.
  protected onBeforeWidgetInstantiation() {
    BulletChart.Inject(BulletTooltip, BulletChartLegend);
  }

  // The chart derives its element id from a counter that restarts for every instance, so several charts on one
  // page would share an id and render into the last element. Give each host element a unique id.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `bulletChart_bridge_${bulletChartIds++}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // BulletChart.onPropertyChanged only re-renders for a handful of properties (title, size, ranges, axis range,
    // fills...). Everything else is silently ignored after the first render, so for those update the property
    // without notifying and refresh the chart. ControlBase calls `<property>Changed` when it exists.
    unhandledProperties.forEach((name) => {
      this[`${name}Changed`] = (value: any) => {
        if (!this.widget) { return; }
        (<any>this.widget).setProperties({ [name]: value }, true);
        this.widget.refresh();
      };
    });
  }

  protected onWidgetCreated() {
  }
}
