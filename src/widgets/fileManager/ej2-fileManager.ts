
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from "aurelia-framework"
import { FileManager, FileManagerModel, Toolbar, NavigationPane, DetailsView, ContextMenu } from "@syncfusion/ej2-filemanager";

@generateBindables("fileManager")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-file-manager')
export class Ej2FileManager extends SyncfusionWrapper<FileManager, FileManagerModel> {
  protected syncfusionWidgetType = FileManager;

  onBeforeWidgetInstantiation() {
    FileManager.Inject(Toolbar, NavigationPane, DetailsView, ContextMenu);
  }
  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {

  }
}
