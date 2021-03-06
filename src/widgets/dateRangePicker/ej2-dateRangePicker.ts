import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DateRangePicker, DateRangePickerModel } from "@syncfusion/ej2-calendars";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("dateRangePicker")
@customElement('ej2-date-range-picker')
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
export class Ej2DateRangePicker extends SyncfusionWrapper<DateRangePicker, DateRangePickerModel> {
  protected syncfusionWidgetType = DateRangePicker;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
    this[`${constants.bindablePrefix}startDate`] = args.startDate;
    this[`${constants.bindablePrefix}endDate`] = args.endDate;
  }
}
