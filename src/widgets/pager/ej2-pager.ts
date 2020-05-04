import { PagerModel, Pager } from "@syncfusion/ej2-grids";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("pager")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-pager')
export class Ej2Pager extends SyncfusionWrapper<Pager, PagerModel> {
  protected syncfusionWidgetType = Pager;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
