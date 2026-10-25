import { PLATFORM } from 'aurelia-pal';
import { logEvent } from '../documentEditor/docLog';
import { sampleSfdt } from '../documentEditor/sampleSfdt';

export class DocumentEditorContainerDemo {
  mainContainer: any;
  parts = [
    PLATFORM.moduleName('documentEditorContainer/documentEditorContainerRibbonDemo'),
    PLATFORM.moduleName('documentEditorContainer/documentEditorContainerServerDemo')
  ];
  showToolbar = true;
  showPane = true;
  restricted = false;
  tracking = false;
  toolbarItems: any = ["New", "Open", "Separator", "Undo", "Redo", {"id": "demo_custom", "text": "Custom", "tooltipText": "Custom toolbar item", "prefixIcon": "e-de-ctnr-new"}];
  layoutType: any = "Pages";
  currentUser: any = "demo@example.com";
  userColor: any = "#ff0000";
  enableLocalPaste: any = true;
  zIndex: any = 5;
  enableComment: any = true;
  enableAutoFocus: any = false;
  autoResizeOnVisibilityChange: any = true;
  enableCsp: any = true;
  documentEditorSettings: any = {"searchHighlightColor": "#ffff00", "showRuler": false};
  documentSettings: any = {"compatibilityMode": "Word2013"};
  height: any = "560px";
  width: any = "100%";

  log = (name: string, args?: any) => logEvent(`dc.${name}`, args);

  load() { this.mainContainer.widget.documentEditor.open(sampleSfdt); }
}
