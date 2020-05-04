import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DashboardLayout, DashboardLayoutModel } from '@syncfusion/ej2-layouts';
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("dashboardLayout")
@inlineView(`<template><div class="dashboard-container"><div element.ref="widgetElement"><slot></slot></div></div></template>`)
@customElement("ej2-dashboard-layout")
export class Ej2DashboardLayout extends SyncfusionWrapper<DashboardLayout, DashboardLayoutModel> {
  protected syncfusionWidgetType = DashboardLayout;
  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
