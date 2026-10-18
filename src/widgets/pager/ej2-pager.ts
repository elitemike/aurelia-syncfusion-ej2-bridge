import { PagerModel, Pager, PagerDropDown, ExternalMessage } from "@syncfusion/ej2-grids";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from "../../common/constants";

@generateBindables("pager")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-pager')
export class Ej2Pager extends SyncfusionWrapper<Pager, PagerModel> {
  protected syncfusionWidgetType = Pager;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
    // the pager only reports page changes through its events
    this.widget.addEventListener("click", (args: any) => {
      this[`${constants.bindablePrefix}currentPage`] = args.currentPage;
    });
  }

  onBeforeWidgetInstantiation() {
    // pageSizes and externalMessage need these modules
    Pager.Inject(PagerDropDown, ExternalMessage);
  }
}
