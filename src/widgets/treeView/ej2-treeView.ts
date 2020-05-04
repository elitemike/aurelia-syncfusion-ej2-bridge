import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { TreeView, TreeViewModel } from '@syncfusion/ej2-navigations';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("treeView")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-tree-view')
export class Ej2TreeView extends SyncfusionWrapper<TreeView, TreeViewModel> {
  protected syncfusionWidgetType = TreeView;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
