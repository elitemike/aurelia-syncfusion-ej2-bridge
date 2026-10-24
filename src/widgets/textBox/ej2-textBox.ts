import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { TextBox, TextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
import { inlineView, customElement } from 'aurelia-framework';
enableRipple(true);

@generateBindables("textBox")
@inlineView(`<template><input element.ref="widgetElement" /></template>`)
@customElement('ej2-text-box')
export class Ej2TextBox extends SyncfusionWrapper<TextBox, TextBoxModel>{
  protected syncfusionWidgetType = TextBox;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("input", (args) => { _this.onInput(args) });
  }

  valueChanged(newValue) {
    const latest = this[`${constants.bindablePrefix}value`];
    if (latest === (<any>this.widget).value) {
      return;
    }
    if (this.widget.element && (<any>this.widget.element).value === latest) {
      // the value was typed, the input already shows it. Keep the widget in sync without raising a `change`
      // per keystroke, the widget raises it itself when the input is committed.
      this.widget.setProperties({ value: latest }, true);
    } else {
      this.widget.value = latest;
    }
  }

  onInput(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
