import { DocumentEditorContainer, DocumentEditorContainerModel, Toolbar, Ribbon } from '@syncfusion/ej2-documenteditor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("documentEditorContainer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-document-editor-container')
export class Ej2DocumentEditorContainer extends SyncfusionWrapper<DocumentEditorContainer, DocumentEditorContainerModel> {
  protected syncfusionWidgetType = DocumentEditorContainer;

  protected onBeforeWidgetInstantiation() {
    // the container activates Toolbar or Ribbon from toolbarMode, Inject registers both globally
    DocumentEditorContainer.Inject(Toolbar, Ribbon);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
