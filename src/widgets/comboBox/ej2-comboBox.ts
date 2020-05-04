import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { ComboBox, ComboBoxModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";

@generateBindables("comboBox")
@inlineView(`<template><input type="text" tabindex="1" element.ref="widgetElement" /></template>`)
@customElement('ej2-combo-box')
export class Ej2ComboBox extends SyncfusionWrapper<ComboBox, ComboBoxModel> {
  protected syncfusionWidgetType = ComboBox;

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
