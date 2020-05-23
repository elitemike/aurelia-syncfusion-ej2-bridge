import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Sidebar, SidebarModel } from "@syncfusion/ej2-navigations";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("sidebar")
@inlineView(`<template><aside element.ref="widgetElement"><slot name="side-bar"></slot></aside><slot name="content"></slot></template>`)
@customElement('ej2-sidebar')
export class Ej2Sidebar extends SyncfusionWrapper<Sidebar, SidebarModel> {
  protected syncfusionWidgetType = Sidebar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;

  }
}
