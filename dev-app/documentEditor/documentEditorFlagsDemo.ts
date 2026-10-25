import { logEvent } from '../documentEditor/docLog';

export class DocumentEditorFlagsDemo {
  deoffEd: any;
  log = (name: string, args?: any) => logEvent(`de-off.${name}`, args);
  enablePrint: any = false;
  enableSelection: any = false;
  enableEditor: any = false;
  enableEditorHistory: any = false;
  enableSfdtExport: any = false;
  enableWordExport: any = false;
  enableTextExport: any = false;
  enableOptionsPane: any = false;
  enableContextMenu: any = false;
  enableHyperlinkDialog: any = false;
  enableBookmarkDialog: any = false;
  enableTableOfContentsDialog: any = false;
  enableSearch: any = false;
  enableParagraphDialog: any = false;
  enableListDialog: any = false;
  enableTablePropertiesDialog: any = false;
  enableBordersAndShadingDialog: any = false;
  enableFootnoteAndEndnoteDialog: any = false;
  enableColumnsDialog: any = false;
  enablePageSetupDialog: any = false;
  enableStyleDialog: any = false;
  enableFontDialog: any = false;
  enableTableOptionsDialog: any = false;
  enableTableDialog: any = false;
  enableImageResizer: any = false;
  enableComment: any = false;
  enableFormField: any = false;
  layoutType: any = "Continuous";
  height: any = "300px";
  width: any = "100%";
}
