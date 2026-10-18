import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Sidebar, SidebarModel } from "@syncfusion/ej2-navigations";
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';

@generateBindables("sidebar")
@inlineView(`<template element.ref="widgetElement"><slot></slot></template>`)
@customElement('ej2-sidebar')
export class Ej2Sidebar extends SyncfusionWrapper<Sidebar, SidebarModel> {
  protected syncfusionWidgetType = Sidebar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // isOpen changes through user interaction and toggle(), the widget only reports them through events
    const sync = () => {
      this[`${constants.bindablePrefix}isOpen`] = this.widget.isOpen;
    };
    ['open', 'close', 'change'].forEach((name) => this.widget.addEventListener(name, sync));
  }
}
