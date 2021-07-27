import { Disposable } from 'aurelia-binding';
import { Subscription } from "aurelia-event-aggregator"
import { RadioButtonModel, RadioButton } from '@syncfusion/ej2-buttons';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("radio")
@inlineView(`<template><input element.ref="widgetElement" type="radio" /></template>`)
@customElement('ej2-radio')
export class Ej2Radio extends SyncfusionWrapper<RadioButton, RadioButtonModel> {
  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {
  }
  protected syncfusionWidgetType = RadioButton;

  checkedSubscription: Disposable = null;
  selectionChangedSubscription: Subscription = null;


  onBind() {
    if (!this._eModel.name) {
      throw "Radio e-name is required";
    }

    this.widget.change = () => {
      this[`${constants.bindablePrefix}checked`] = this.widget.checked;
      this.eventAggregator.publish(`ej2-radio-${this._eModel.name}-changed`, this[`${constants.bindablePrefix}label`]);
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, this[`${constants.bindablePrefix}checked`]).subscribe((newValue) => {
      this.widget.checked = newValue;
    });

    this.selectionChangedSubscription = this.eventAggregator.subscribe(`ej2-radio-${this._eModel.name}-changed`, (selectedLabel: string) => {
      if (this[`${constants.bindablePrefix}label`] !== selectedLabel) {
        this[`${constants.bindablePrefix}checked`] = false;
      }
    });
  }

  detached() {
    this.checkedSubscription.dispose();
    this.selectionChangedSubscription.dispose();
    super.detached();
  }
}
