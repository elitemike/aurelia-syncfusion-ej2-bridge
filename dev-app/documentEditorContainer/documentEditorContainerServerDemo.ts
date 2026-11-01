import { Ej2DocumentEditorContainer } from 'widgets/documentEditorContainer/ej2-documentEditorContainer';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DocumentEditorContainer)
export class DocumentEditorContainerServerDemo {
  dcserverEd: any;
  serviceUrl: any = "/documenteditor-service/api/documenteditor/";
  serverActionSettings: any = {"systemClipboard": "SystemClipboard", "restrictEditing": "RestrictEditing"};
  headers: any = [{"X-Demo": "1"}];
  enableSpellCheck: any = false;
  enableLockAndEdit: any = false;
  enableWebMcp: any = false;
  webMcpSettings: any = {"name": "demo-container", "tools": []};
  height: any = "300px";
  width: any = "100%";
}
