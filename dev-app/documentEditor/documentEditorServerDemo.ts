import { logEvent } from '../documentEditor/docLog';
import { Ej2DocumentEditor } from 'widgets/documentEditor/ej2-documentEditor';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2DocumentEditor)
export class DocumentEditorServerDemo {
  deserverEd: any;
  log = (name: string, args?: any) => logEvent(`server.${name}`, args);
  serviceUrl: any = "/documenteditor-service/api/documenteditor/";
  serverActionSettings: any = {"systemClipboard": "SystemClipboard", "spellCheck": "SpellCheck", "restrictEditing": "RestrictEditing"};
  headers: any = [{"X-Demo": "1"}];
  enableSpellCheck: any = false;
  enableCollaborativeEditing: any = false;
  enableLockAndEdit: any = false;
  enableWebMcp: any = false;
  webMcpSettings: any = {"name": "demo-doc", "tools": []};
  height: any = "300px";
  width: any = "100%";
}
