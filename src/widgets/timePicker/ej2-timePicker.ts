import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { TimePicker, TimePickerModel, MaskedDateTime } from "@syncfusion/ej2-calendars";
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("timePicker")
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
@customElement('ej2-time-picker')
export class Ej2TimePicker extends SyncfusionWrapper<TimePicker, TimePickerModel> {
  protected syncfusionWidgetType = TimePicker;

  protected onBeforeWidgetInstantiation() {
    TimePicker.Inject(MaskedDateTime);
  }

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
