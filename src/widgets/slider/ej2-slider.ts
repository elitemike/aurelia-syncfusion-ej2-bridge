import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Slider, SliderModel, SliderChangeEventArgs } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from 'aurelia-framework';
import _ from 'lodash';

@generateBindables("slider")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-slider')
export class Ej2Slider extends SyncfusionWrapper<Slider, SliderModel> {
  private containerResizeObserver: ResizeObserver = null;
  private resize = _.debounce(() => {
    this.taskQueue.queueTask(() => {
      this.widget?.refresh();
    });
  }, 100);

  protected syncfusionWidgetType = Slider;

  private lastSize: string = null;

  protected onWrapperCreated() {
    this.onTeardown();
    this.lastSize = null;
    this.containerResizeObserver = new ResizeObserver((entries) => {
      // the observer always reports once on observe(); refresh() rebuilds the DOM and drops focus, so only act on a real change
      const { width, height } = entries[entries.length - 1].contentRect;
      const size = `${width}x${height}`;
      if (size === this.lastSize) {
        return;
      }
      const initial = this.lastSize === null;
      this.lastSize = size;
      if (!initial) {
        this.resize();
      }
    });

    this.containerResizeObserver.observe(this.widgetElement);
  }

  protected onTeardown() {
    if (this.containerResizeObserver) {
      this.containerResizeObserver.disconnect();
      this.containerResizeObserver = null;
    }
    this.resize.cancel();
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("changed", (event: SliderChangeEventArgs) => {
      _this.onChanged(event);
    });
  }

  onChanged(event: SliderChangeEventArgs) {
    this[`${constants.bindablePrefix}value`] = event.value;
  }
}
