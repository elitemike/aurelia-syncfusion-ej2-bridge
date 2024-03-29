import { Disposable } from 'aurelia-binding';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { autoinject, inlineView, customElement, transient } from 'aurelia-framework';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';

@autoinject
@transient()
@generateBindables("checkbox")
@customElement("ej2-checkbox")
@inlineView(`<template><input element.ref="widgetElement" type="checkbox" /></template>`)
export class Ej2Checkbox extends SyncfusionWrapper<CheckBox, CheckBoxModel> {

  protected onWidgetCreated() {
    this.widget.element.addEventListener("click", this._onClick.bind(this))
  }
  protected onWrapperCreated() {
  }

  protected syncfusionWidgetType = CheckBox;


  checkedSubscription: Disposable = null;

  onBind() {
    this.widget.change = () => {
      // console.log("changed", this.widget.checked)

      // console.log("current widget value", this[`${constants.bindablePrefix}checked`])
      this[`${constants.bindablePrefix}checked`] = this.widget.checked;
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, "checked").subscribe((newValue) => {
      this.widget.checked = newValue;
    });
  }


  _onClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.taskQueue.queueTask(() => {
      let clickEvent = new CustomEvent("on-click", {
        bubbles: true,
        detail: { checked: this[`${constants.bindablePrefix}checked`] }
      });

      this.element.dispatchEvent(clickEvent);
    });
  }


  detached() {
    this.checkedSubscription.dispose();
    this.widget.element.removeEventListener("click", this._onClick);
    super.detached();
  }
}
