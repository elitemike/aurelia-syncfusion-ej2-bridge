import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { TreeView, TreeViewModel } from '@syncfusion/ej2-navigations';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';

@generateBindables("treeView")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-tree-view')
export class Ej2TreeView extends SyncfusionWrapper<TreeView, TreeViewModel> {
  protected syncfusionWidgetType = TreeView;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
    // the node collections are two-way bound but the widget only reports them through its events
    const sync = () => {
      this.pushCollection('selectedNodes');
      this.pushCollection('checkedNodes');
      this.pushCollection('expandedNodes');
    };
    ['nodeSelected', 'nodeChecked', 'nodeExpanded', 'nodeCollapsed'].forEach((name) => {
      this.widget.addEventListener(name, sync);
    });
  }

  private pushCollection(property: string) {
    const bindable = `${constants.bindablePrefix}${property}`;
    const current: string[] = this.widget[property] || [];
    const bound = this[bindable];
    if (bound !== undefined && !(Array.isArray(bound) && bound.length === current.length && bound.every((v, i) => v === current[i]))) {
      this[bindable] = current.slice();
    }
  }
}
