import { computedFrom } from 'aurelia-framework';
import { Ej2RichTextEditorUI } from 'widgets/richTextEditorUI/ej2-richTextEditorUI';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2RichTextEditorUI)
export class RichTextEditorUIDemo {
  value = '<p>Hello <b>Rich Text Editor UI</b></p>';
  counts: { [key: string]: number } = {
    change: 0, focus: 0, blur: 0, actionBegin: 0, actionComplete: 0, outside: 0, beforeDialogOpen: 0,
    beforeDialogClose: 0, beforeFileUpload: 0, fileUploading: 0, fileSelected: 0, fileUploadSuccess: 0,
    fileUploadFailed: 0, fileRemoving: 0, beforeFileDrop: 0, created: 0, destroyed: 0
  };
  beginName = '';

  toolbarSettings = {
    items: ['Undo', 'Redo', '|', 'Bold', 'Italic', '|', 'FontName', 'FontSize', 'Formats', '|', 'FontColor',
      'BackgroundColor', '|', 'NumberFormatList', 'BulletFormatList'],
    type: 'MultiRow',
    position: 'Top',
    enableFloating: false
  };
  fontSize = { width: '80px', items: [{ text: '12', value: '12px' }, { text: '18', value: '18px' }, { text: '32', value: '32px' }] };
  fontFamily = { width: '140px', items: [{ text: 'Arial', value: 'Arial,Helvetica,sans-serif' }, { text: 'Georgia', value: 'Georgia,serif' }] };
  format = { width: '110px', items: ['Paragraph', 'Heading 1', 'Heading 2'] };
  fontColor = { default: '#ff0000', mode: 'Palette', columns: 5, modeSwitcher: false, showRecentColors: false };
  backgroundColor = { default: '#ffff00', mode: 'Picker', columns: 6, modeSwitcher: true, showRecentColors: true };
  listSettings = { numberFormatListItems: ['decimal', 'lower-roman'], bulletFormatListItems: ['disc', 'square'], checklistType: 'Square' };

  quickValue = '<p>Select text for the quick toolbar <a href="https://example.com">link</a></p>' +
    '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" alt="dot" width="40" height="40"></p>' +
    '<table><tbody><tr><td><p>A1</p></td><td><p>B1</p></td></tr><tr><td><p>A2</p></td><td><p>B2</p></td></tr></tbody></table><p>After</p>';

  quickToolbarSettings = {
    enable: true,
    text: ['Bold', 'Italic', 'Underline'],
    link: ['Open', 'Edit', 'Remove'],
    image: ['Replace', 'Remove'],
    table: ['Row', 'Column', 'Remove'],
    enableAppendToBody: false
  };
  linkSettings = { linkOnPaste: true, defaultTarget: '_blank', autoPrependProtocol: true, defaultProtocol: 'https://', allowedProtocols: ['http://', 'https://', 'mailto:'] };
  tableSettings = { resize: false };
  keyBindings = { bold: 'ctrl+shift+b' };
  interactionSettings = { enableAutoFormat: true, enableTabKeyIndent: true };

  slashCommandSettings = {
    enable: true,
    items: ['Paragraph', 'Heading 1', 'Heading 2', 'BulletList', 'NumberedList'],
    popupWidth: 280,
    popupHeight: 240
  };

  docValue: any = {
    type: 'document', attrs: {}, marks: [], schemaVersion: 1,
    children: [{ type: 'paragraph', children: [{ type: 'text', text: 'JSON content' }] }]
  };

  enable = true;
  readonly = false;
  width = '100%';
  height = '240px';
  cssClass = 'rteui-first';
  htmlAttributes = { 'data-rteui': 'state', 'aria-label': 'State editor' };

  imageSettings = {
    allowedTypes: ['.png', '.jpg'],
    maxFileSize: 500000,
    uploadUrl: '/api/rteui/upload',
    removeUrl: '/api/rteui/remove',
    imageUrl: '/images/',
    saveFormat: 'Blob',
    display: 'inline',
    dimension: { width: 200, minWidth: 50, maxWidth: 400 },
    resize: true
  };

  showEditor = true;

  resize() {
    this.width = '420px';
    this.height = '180px';
    this.cssClass = 'rteui-second';
  }

  count(name: string) {
    this.counts[name]++;
  }

  onChange(event: CustomEvent) {
    this.count('change');
  }

  onActionBegin(event: CustomEvent) {
    this.count('actionBegin');
    this.beginName = String(event.detail.name || event.detail.requestType || '');
  }

  onActionComplete(event: CustomEvent) {
    this.count('actionComplete');
  }

  applyDropdowns() {
    this.fontSize = { width: '90px', items: [{ text: '20', value: '20px' }, { text: '40', value: '40px' }] };
    this.fontFamily = { width: '150px', items: [{ text: 'Verdana', value: 'Verdana,sans-serif' }] };
    this.format = { width: '120px', items: ['Paragraph', 'Heading 3'] };
  }

  setDocument() {
    this.docValue = {
      type: 'document', attrs: {}, marks: [], schemaVersion: 1,
      children: [{ type: 'heading', attrs: { level: 2 }, children: [{ type: 'text', text: 'Set by view-model' }] }]
    };
  }

  @computedFrom('docValue')
  get docType() {
    return this.docValue && typeof this.docValue === 'object' ? 'object' : typeof this.docValue;
  }

  @computedFrom('docValue')
  get docText() {
    return JSON.stringify(this.docValue);
  }
}
