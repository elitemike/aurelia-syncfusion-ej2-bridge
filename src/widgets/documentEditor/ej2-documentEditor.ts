import { DocumentEditor, DocumentEditorModel } from '@syncfusion/ej2-documenteditor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("documentEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-document-editor')
export class Ej2DocumentEditor extends SyncfusionWrapper<DocumentEditor, DocumentEditorModel> {
  protected syncfusionWidgetType = DocumentEditor;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
