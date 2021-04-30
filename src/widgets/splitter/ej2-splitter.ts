import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from "../../utilities/decorator";
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { Splitter, SplitterModel } from '@syncfusion/ej2-layouts';

@generateBindables("splitter")
@inlineView(`<template><div element.ref="widgetElement"><slot></slot></div></template>`)
@customElement('ej2-splitter')
export class Ej2Splitter extends SyncfusionWrapper<Splitter, SplitterModel> {
  protected onWrapperCreated() {
    // this.debug("splitter wrapper created")

  }
  protected onWidgetCreated() {
    //  this.debug("splitter widget created", this.widget)

  }

  protected syncfusionWidgetType = Splitter;
}
