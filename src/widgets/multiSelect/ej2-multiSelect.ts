import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { MultiSelect, MultiSelectModel, CheckBoxSelection } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
import { inlineView, customElement } from 'aurelia-framework';
enableRipple(true);

@generateBindables("multiSelect")
@inlineView(`<template><div><slot><input /></slot></div></template>`)
@customElement('ej2-multi-select')
export class Ej2MultiSelect extends SyncfusionWrapper<MultiSelect, MultiSelectModel>{
  protected syncfusionWidgetType = MultiSelect;

  onBeforeWidgetInstantiation() {
    // mode="CheckBox" and showSelectAll need this module
    MultiSelect.Inject(CheckBoxSelection);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onInput(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }

  onChange(args) {
    // the widget can hand back the same array instance it mutated, which Aurelia's observer would ignore
    this[`${constants.bindablePrefix}value`] = Array.isArray(args.value) ? args.value.slice() : args.value;
  }


  attached() {
    this.widgetElement = this.element.querySelector("select,input") as HTMLElement;

    super.attached();
  }
}
