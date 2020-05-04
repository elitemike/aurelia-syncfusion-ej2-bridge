import { constants } from './../../common/constants';
import { DatePicker, DatePickerModel } from "@syncfusion/ej2-calendars";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("datePicker")
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
@customElement("ej2-date-picker")
export class Ej2DatePicker extends SyncfusionWrapper<DatePicker, DatePickerModel>  {
  protected syncfusionWidgetType = DatePicker;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
