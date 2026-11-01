import { MarkdownFormatter, RichTextEditor, RichTextEditorModel } from '@syncfusion/ej2/richtexteditor';
import { IEJ2WidgetBridge } from 'index';
import { Ej2RichTextEditor } from 'widgets/richTextEditor/ej2-richTextEditor';
import { viewResources } from 'aurelia-framework';

// 1x1 png used for the image samples
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

@viewResources(Ej2RichTextEditor)
export class RichTextEditorDemo {
  value = '<p>Some content</p>';
  editor: IEJ2WidgetBridge<RichTextEditor> = null;
  xhtml: string = null;
  changeCount = 0;

  toolbarSettings = { items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', '|', 'NumberFormatList', 'BulletFormatList', '|', 'CreateLink', 'SourceCode', 'Undo', 'Redo'] };
  limited: RichTextEditorModel = { showCharCount: true, maxLength: 20, value: 'short' };
  readonlyValue = '<p>Cannot edit</p>';
  valueTemplate = '<p>content from the template</p>';
  exportValue = '<p>export me</p>';
  mcpValue = '<p>mcp</p>';
  byeValue = '<p>bye</p>';
  inlineValue = '<p>Select some of this text</p>';
  pasteCleanupSettings = { prompt: false, plainText: false, keepFormat: false, deniedTags: ['a'], deniedAttrs: ['class'], allowedStyleProps: ['color'] };

  // every raised event is counted per section: logs[section] looks like "name:count name:count"
  counts: { [section: string]: { [name: string]: number } } = {};
  logs: { [section: string]: string } = {};

  // look and feel section
  enabled = true;
  lookValue = '';
  htmlAttributes = { 'data-x': 'y' };
  lookToolbar = {
    type: 'MultiRow',
    items: ['FontName', 'FontSize', 'FontColor', 'BackgroundColor', 'Formats', 'NumberFormatList', 'BulletFormatList', 'LineHeight',
      'CodeBlock', 'EmojiPicker', 'FormatPainter', 'CreateTable']
  };
  fontFamily = { default: 'Demo Font', items: [{ text: 'Demo Font', value: 'Verdana', class: 'e-demo-font' }, { text: 'Other Font', value: 'Arial', class: 'e-other-font' }] };
  fontSize = { default: '18pt', items: [{ text: '18pt', value: '18pt' }, { text: '24pt', value: '24pt' }] };
  fontColor = { default: '#ff0000', mode: 'Palette', columns: 5, colorCode: { Custom: ['#ff0000', '#00ff00', '#0000ff'] } };
  backgroundColor = { default: '#ffff00', mode: 'Palette', columns: 5, colorCode: { Custom: ['#ffff00', '#00ffff'] } };
  format = { default: 'Heading 2', width: '120px', types: [{ text: 'Paragraph', value: 'P' }, { text: 'Heading 2', value: 'H2' }, { text: 'Quote', value: 'BLOCKQUOTE' }] };
  numberFormatList = { types: [{ text: 'None', value: 'None' }, { text: 'Lower Alpha', value: 'lowerAlpha' }] };
  bulletFormatList = { types: [{ text: 'None', value: 'None' }, { text: 'Square', value: 'square' }] };
  lineHeight = { default: '1.5', items: [{ text: '1.5', value: '1.5' }, { text: 'Double', value: '2' }] };
  codeBlockSettings = { languages: [{ label: 'Plain text', language: 'plaintext' }, { label: 'Demo script', language: 'demoscript' }], defaultLanguage: 'plaintext' };
  tableSettings = { width: '60%', minWidth: 100, maxWidth: 400, resize: true, styles: [{ text: 'Demo style', class: 'e-demo-table', command: 'Table', subCommand: 'Dashed' }] };
  formatPainterSettings = { allowedFormats: 'b;em;font;u', deniedFormats: null };
  emojiPickerSettings = { iconsSet: [{ name: 'Demo', code: '1F600', iconCss: 'e-emoji' }] };

  // behaviour section
  behValue = '<p>start</p>';
  behKeyConfig = { bold: 'ctrl+q' };

  // quick toolbar and events section
  evValue = '<p>Hello <a href="https://example.com">a link</a> and text to select</p>';
  evToolbar = { items: ['Bold', 'Italic', 'Underline', 'FontColor', 'Formats', 'CreateLink', 'Image', 'CreateTable', 'Undo', 'Redo', 'Print'] };
  quickToolbarSettings = { link: ['Open', 'Edit', 'UnLink'], text: ['Bold', 'Italic'], enable: true };
  slashMenuSettings = { enable: true, items: ['Paragraph', 'Heading 1', 'OrderedList'] };

  // sanitizer and encoding
  dirtyValue = '<p>clean</p><img src="x" onerror="window.__xss = 1">';
  encValue = '<p>a &amp; b</p>';

  // markdown
  mdValue = 'markdown text';
  mdToolbar = { items: ['Bold', 'Italic', 'Undo', 'Redo'] };
  mdFormatter = new MarkdownFormatter({ selectionTags: { Bold: '__', Italic: '*' } } as any);

  // inline mode and iframe
  inlineMode = { enable: true, onSelection: true };
  iframeSettings = { enable: true, attributes: { 'data-frame': 'yes' } };

  // media
  mediaValue = `<p>Image: <img id="media-img" src="${pixel}" style="width: 40px"/></p><p><br></p>`;
  mediaToolbar = { items: ['Image', 'Audio', 'Video', 'Undo'] };
  insertImageSettings = { saveUrl: '/api/file/upload/test', path: '/api/file/uploads/', allowedTypes: ['.png', '.jpg'], display: 'inline', width: '50px', saveFormat: 'Base64', resize: true };
  insertAudioSettings = { saveUrl: '/api/file/upload/test', path: '/api/file/uploads/', allowedTypes: ['.mp3'] };
  insertVideoSettings = { saveUrl: '/api/file/upload/test', path: '/api/file/uploads/', allowedTypes: ['.mp4'], width: '100px' };
  fileManagerSettings = { enable: true, ajaxSettings: { url: '/api/file/fm', uploadUrl: '/api/file/fm/upload' } };

  // import and export
  ioToolbar = { items: ['ImportWord', 'ExportWord', 'ExportPdf'] };
  importWord = { serviceUrl: '/api/file/rte/import' };
  exportWord = { serviceUrl: '/api/file/rte/exportword', fileName: 'demo.docx', stylesheet: '.e-rte-content { color: red; }' };
  exportPdf = { serviceUrl: '/api/file/rte/exportpdf', fileName: 'demo.pdf', stylesheet: '.e-rte-content { color: blue; }' };

  // ai assistant and web mcp
  aiToolbar = { items: ['AICommands', 'AIQuery', 'Bold'] };
  aiAssistantSettings = { placeholder: 'Ask the demo', prompts: [{ prompt: 'Summarize', response: 'Short.' }] } as any;
  webMcpSettings = { name: 'demo-rte', tools: ['getContent', 'getSelectedHtml'] };

  // lifecycle
  showTemp = true;

  // resize
  resizeValue = '<p>resize me</p><table class="e-rte-table" style="width: 50%;"><tbody><tr><td><br></td><td><br></td></tr></tbody></table>';

  log(section: string, name: string) {
    const counts = this.counts[section] = this.counts[section] || {};
    counts[name] = (counts[name] || 0) + 1;
    this.logs = Object.assign({}, this.logs, { [section]: Object.keys(counts).map(k => `${k}:${counts[k]}`).join(' ') });
  }

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
