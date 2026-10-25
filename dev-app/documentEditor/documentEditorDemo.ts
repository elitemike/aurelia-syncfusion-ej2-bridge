import { PLATFORM } from 'aurelia-pal';
import { logEvent } from './docLog';
import { sampleSfdt } from './sampleSfdt';

export class DocumentEditorDemo {
  mainEditor: any;
  parts = [
    PLATFORM.moduleName('documentEditor/documentEditorFlagsDemo'),
    PLATFORM.moduleName('documentEditor/documentEditorServerDemo')
  ];
  zoom = 1;
  name = 'Demo document';
  readOnly = false;
  trackChanges = false;
  layoutType: any = "Pages";
  currentUser: any = "demo@example.com";
  userColor: any = "#ff0000";
  pageGap: any = 12;
  enablePrint: any = true;
  enableSelection: any = true;
  enableEditor: any = true;
  enableEditorHistory: any = true;
  enableSfdtExport: any = true;
  enableWordExport: any = true;
  enableTextExport: any = true;
  enableOptionsPane: any = true;
  enableContextMenu: any = true;
  enableHyperlinkDialog: any = true;
  enableBookmarkDialog: any = true;
  enableTableOfContentsDialog: any = true;
  enableSearch: any = true;
  enableParagraphDialog: any = true;
  enableListDialog: any = true;
  enableTablePropertiesDialog: any = true;
  enableBordersAndShadingDialog: any = true;
  enableFootnoteAndEndnoteDialog: any = true;
  enableColumnsDialog: any = true;
  enablePageSetupDialog: any = true;
  enableStyleDialog: any = true;
  enableFontDialog: any = true;
  enableTableOptionsDialog: any = true;
  enableTableDialog: any = true;
  enableImageResizer: any = true;
  enableComment: any = true;
  enableFormField: any = true;
  acceptTab: any = true;
  useCtrlClickToFollowHyperlink: any = false;
  pageOutline: any = "#ff0000";
  enableCursorOnReadOnly: any = true;
  enableLocalPaste: any = true;
  enableLayout: any = true;
  zIndex: any = 5;
  autoResizeOnVisibilityChange: any = true;
  showComments: any = true;
  showRevisions: any = true;
  enableAutoFocus: any = false;
  defaultPasteOption: any = "KeepSourceFormatting";
  documentEditorSettings: any = {"searchHighlightColor": "#ffff00", "showRuler": false, "pasteAsNewParagraph": false};
  documentSettings: any = {"compatibilityMode": "Word2013"};
  height: any = "520px";
  width: any = "100%";

  log = (name: string, args?: any) => logEvent(`main.${name}`, args);

  load() { this.mainEditor.widget.open(sampleSfdt); }
}
