import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { MaskedTextBox, MaskedTextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
import { inlineView, customElement } from 'aurelia-framework';
enableRipple(true);

@generateBindables("maskedTextBox")
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
@customElement('ej2-masked-text-box')
export class Ej2MaskedTextBox extends SyncfusionWrapper<MaskedTextBox, MaskedTextBoxModel>{
  protected syncfusionWidgetType = MaskedTextBox;
  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("input", (args) => { _this.onInput(args) });
  }

  onInput(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
