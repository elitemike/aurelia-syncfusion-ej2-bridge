
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { inlineView, customElement } from "aurelia-framework"
import { FileManager, FileManagerModel, Toolbar, NavigationPane, DetailsView, ContextMenu, WebMcpFileManager } from "@syncfusion/ej2-filemanager";
import { uuid as uuidv4 } from "../../utilities/uuid";

@generateBindables("fileManager")
@inlineView(`<template><div id.bind="id" element.ref="widgetElement"></div></template>`)
@customElement('ej2-file-manager')
export class Ej2FileManager extends SyncfusionWrapper<FileManager, FileManagerModel> {
  protected syncfusionWidgetType = FileManager;
  public id = `fm-${uuidv4()}`;

  onBeforeWidgetInstantiation() {
    // this.id = uuidv4();
    FileManager.Inject(Toolbar, NavigationPane, DetailsView, ContextMenu, WebMcpFileManager);
  }
  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {

  }
}
