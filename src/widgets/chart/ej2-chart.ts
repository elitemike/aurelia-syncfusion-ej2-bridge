
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from "aurelia-framework"
import { Chart, ChartModel } from '@syncfusion/ej2-charts';

@generateBindables("chart")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-chart')
export class Ej2Chart extends SyncfusionWrapper<Chart, ChartModel> {
  protected syncfusionWidgetType: Chart;
  protected onWrapperCreated() {
    throw new Error('Method not implemented.');
  }

  protected onWidgetCreated() {
    throw new Error('Method not implemented.');
  }

  onBeforeWidgetInstantiation() {
    let chartTypes = [];
    if (this.eModel.series) {
      this.eModel.series.forEach((s) => {
        if (chartTypes.indexOf(s.type) === -1) {
          chartTypes.push(s.type);
        }
      });

      chartTypes.forEach((t) => {

      });
    }    
  }



}
