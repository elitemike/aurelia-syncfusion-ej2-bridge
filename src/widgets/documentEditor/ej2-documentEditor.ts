import {
  DocumentEditor, DocumentEditorModel, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor,
  ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog,
  TableOfContentsDialog, PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, StylesDialog, FontDialog,
  TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, BulletsAndNumberingDialog,
  CheckBoxFormFieldDialog, DropDownFormFieldDialog, TextFormFieldDialog, ColumnsDialog, TabDialog, SpellChecker,
  SpellCheckDialog, ContentControlPropertiesDialog, PicContentControlDialog, DatePickerDialog, NotesDialog,
  XmlPane, CollaborativeEditing, CollaborativeEditingHandler, WebMcpDocumentEditor
} from '@syncfusion/ej2-documenteditor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("documentEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-document-editor')
export class Ej2DocumentEditor extends SyncfusionWrapper<DocumentEditor, DocumentEditorModel> {
  protected syncfusionWidgetType = DocumentEditor;
  private listeners: { name: string, handler: (args: any) => void }[] = [];

  protected onBeforeWidgetInstantiation() {
    // Inject registers modules globally, each module is only active when its enable* flag is on
    DocumentEditor.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer,
      EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog,
      PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, StylesDialog, FontDialog, TablePropertiesDialog,
      BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, BulletsAndNumberingDialog,
      CheckBoxFormFieldDialog, DropDownFormFieldDialog, TextFormFieldDialog, ColumnsDialog, TabDialog, SpellChecker,
      SpellCheckDialog, ContentControlPropertiesDialog, PicContentControlDialog, DatePickerDialog, NotesDialog,
      XmlPane, CollaborativeEditing, CollaborativeEditingHandler, WebMcpDocumentEditor);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    const listen = (name: string, handler: (args: any) => void) => {
      this.listeners.push({ name, handler });
      this.widget.addEventListener(name, handler);
    };
    // the zoom factor changes through the status bar / ctrl+wheel and the open document names itself
    listen('zoomFactorChange', () => {
      this[`${constants.bindablePrefix}zoomFactor`] = this.widget.zoomFactor;
    });
    listen('documentChange', () => {
      this[`${constants.bindablePrefix}documentName`] = this.widget.documentName;
    });
  }

  public detached() {
    if (this.widget) {
      this.listeners.forEach(({ name, handler }) => (this.widget as any).removeEventListener(name, handler));
    }
    this.listeners = [];
    super.detached();
  }
}
