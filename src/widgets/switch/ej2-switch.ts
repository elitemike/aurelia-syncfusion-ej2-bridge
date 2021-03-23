import { constants } from './../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { Switch, SwitchModel } from '@syncfusion/ej2-buttons';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("switch")
@inlineView(`<template><slot></slot><input element.ref="widgetElement" type="checkbox" /></template>`)
@customElement('ej2-switch')
export class Ej2Switch extends SyncfusionWrapper<Switch, SwitchModel> {
  protected syncfusionWidgetType = Switch;
  private id = null;
  private onChange: (args: any)=> void = null;

  protected onWrapperCreated() {
    this.id = this.element.getAttribute("id");

    if (this.id) {
      this.element.removeAttribute("id");
    }

    this.widgetElement.setAttribute("id", this.id);
  }

  protected onWidgetCreated() {
    let _this = this;
    this.onChange = (args) => {
      _this[`${constants.bindablePrefix}checked`] = args.checked;
    };

    this.widget.addEventListener("change", this.onChange);
  }


  public recreate() {
    if (this.id) {
      this.widgetElement.removeAttribute("id");
    }

    this.element.setAttribute("id", this.id);
    super.recreate();
  }

  public detached() {
    this.widget.removeEventListener("change", this.onChange);    
  }
}
