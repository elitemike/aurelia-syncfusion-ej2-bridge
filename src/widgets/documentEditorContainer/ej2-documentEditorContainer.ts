import { DocumentEditorContainer, DocumentEditorContainerModel } from '@syncfusion/ej2-documenteditor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("documentEditorContainer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-document-editor-container')
export class Ej2DocumentEditorContainer extends SyncfusionWrapper<DocumentEditorContainer, DocumentEditorContainerModel> {
  protected syncfusionWidgetType = DocumentEditorContainer;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
