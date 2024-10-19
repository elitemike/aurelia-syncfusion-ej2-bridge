import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";
import { ColorPicker, ColorPickerModel } from '@syncfusion/ej2/inputs';

@generateBindables("colorPicker")
@inlineView(`<template><input type="type="color""  element.ref="widgetElement" /></template>`)
@customElement('ej2-color-picker')
export class Ej2ColorPicker extends SyncfusionWrapper<ColorPicker, ColorPickerModel> {
    protected syncfusionWidgetType = ColorPicker;

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
