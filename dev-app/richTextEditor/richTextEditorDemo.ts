import { RichTextEditor, RichTextEditorModel } from '@syncfusion/ej2/richtexteditor';
import { IEJ2WidgetBridge } from 'index';
import { Ej2RichTextEditor } from 'widgets/richTextEditor/ej2-richTextEditor';

export class RichTextEditorDemo {
    rteContent: string = null;
    editor: IEJ2WidgetBridge<RichTextEditor>;
    model: RichTextEditorModel = {
        value: "Some content",
        toolbarSettings: {
            items: [
                'Undo', 'Redo', '|',
                // 'ImportWord', 'ExportWord', 'ExportPdf', 
                // '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|',
                'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                '|', 'EmojiPicker', 'Print', '|',
                'SourceCode', 'FullScreen']
        },
        slashMenuSettings: {
            enable: true,
            items: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList',
                'CodeBlock', 'Blockquote', 'Link', 'Image', 'Video', 'Audio', 'Table', 'Emojipicker',
            ]
        },
        quickToolbarSettings: {
            text: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor', 'Alignments', '-', 'FontSize', 'FontName', 'Formats', 'OrderedList', 'UnorderedList', 'FormatPainter']
        },
        enableXhtml: true
    }


    getContent() {
        this.rteContent = this.editor.widget.getXhtml();
    }
}