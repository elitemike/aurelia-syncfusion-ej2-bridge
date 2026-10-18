import { RichTextEditor, RichTextEditorModel } from '@syncfusion/ej2/richtexteditor';
import { IEJ2WidgetBridge } from 'index';

export class RichTextEditorDemo {
  value = '<p>Some content</p>';
  editor: IEJ2WidgetBridge<RichTextEditor> = null;
  xhtml: string = null;
  changeCount = 0;

  toolbarSettings = { items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', '|', 'NumberFormatList', 'BulletFormatList', '|', 'CreateLink', 'SourceCode', 'Undo', 'Redo'] };
  limited: RichTextEditorModel = { showCharCount: true, maxLength: 20, value: 'short' };

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = '<p>Set from the view-model</p>';
  }

  getXhtml() {
    this.xhtml = this.editor.widget.getXhtml();
  }
}
