import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DateTimePicker, DateTimePickerModel } from "@syncfusion/ej2-calendars";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("dateTimePicker")
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
@customElement('ej2-date-time-picker')
export class Ej2DateTimePicker extends SyncfusionWrapper<DateTimePicker, DateTimePickerModel> {
  protected syncfusionWidgetType = DateTimePicker;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    //  console.log("changed", args)
    // console.log("this", this)
    //  console.log("current value", this[`${constants.bindablePrefix}value`])
    this[`${constants.bindablePrefix}value`] = args.value;
    //  console.log("current value after update", this[`${constants.bindablePrefix}value`])
  }
}
