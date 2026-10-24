import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { ListView, ListViewModel, Virtualization } from "@syncfusion/ej2-lists";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("listView")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-list-view')
export class Ej2ListView extends SyncfusionWrapper<ListView, ListViewModel> {

  protected syncfusionWidgetType = ListView;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }

  onBeforeWidgetInstantiation() {
    // the list only wires its scroll listener when a scroll handler is defined, event listeners added later are not enough
    if (!this._eModel.scroll) {
      this._eModel.scroll = () => { };
    }
    if (this._eModel.enableVirtualization) {
      ListView.Inject(Virtualization);
    }
  }
}
