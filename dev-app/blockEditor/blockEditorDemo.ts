const text = (content: string) => [{ contentType: 'Text', content }];

export class BlockEditorDemo {
  counts: { [key: string]: number } = {
    created: 0, blockChanged: 0, selectionChanged: 0, focus: 0, blur: 0, outside: 0, blockDragStart: 0,
    blockDragging: 0, blockDropped: 0, beforePasteCleanup: 0, afterPasteCleanup: 0, beforeFileUpload: 0,
    fileUploading: 0, fileUploadSuccess: 0, fileUploadFailed: 0
  };
  lastAction = '';

  blocks = [
    { id: 'b-title', blockType: 'Heading', properties: { level: 1 }, content: text('Block Editor title') },
    { id: 'b-intro', blockType: 'Paragraph', content: text('Paragraph block content') },
    { id: 'b-todo', blockType: 'Checklist', properties: { isChecked: false }, content: text('Checklist item') },
    { id: 'b-bullet', blockType: 'BulletList', content: text('Bullet item') }
  ];

  height = '260px';
  width = '100%';
  cssClass = 'be-first';
  readOnly = false;
  dragAndDrop = true;
  keyConfig = { bold: 'ctrl+shift+b' };
  stateBlocks = [
    { id: 's-1', blockType: 'Paragraph', content: text('First state block') },
    { id: 's-2', blockType: 'Paragraph', content: text('Second state block') },
    { id: 's-3', blockType: 'Paragraph', content: text('Third state block') }
  ];

  menuBlocks = [
    { id: 'm-1', blockType: 'Paragraph', content: text('Type a slash for the command menu') },
    { id: 'm-2', blockType: 'Code', content: text('const answer = 42;'), properties: { language: 'javascript' } }
  ];
  commandMenuSettings = {
    popupWidth: '260px',
    popupHeight: '220px',
    commands: [
      { id: 'cmd-para', type: 'Paragraph', label: 'Text' },
      { id: 'cmd-h1', type: 'Heading', label: 'Big heading' },
      { id: 'cmd-quote', type: 'Quote', label: 'Quote it' }
    ]
  };
  inlineToolbarSettings = { enable: true, popupWidth: '320px', items: ['Bold', 'Italic', 'Underline', '|', 'Color'] };
  transformSettings = { items: ['Paragraph', 'Heading1', 'Quote'], popupWidth: '200px', popupHeight: '180px' };
  blockActionMenuSettings = {
    enable: true, enableTooltip: true, popupWidth: '200px', popupHeight: '200px',
    items: [{ id: 'ba-delete', label: 'Remove block' }, { id: 'ba-dup', label: 'Copy block' }]
  };
  contextMenuSettings = {
    enable: true, showItemOnClick: false,
    items: [{ id: 'cm-custom', text: 'Custom entry' }],
    table: ['Insert', 'Delete'], link: ['Edit', 'Open']
  };
  labelSettings = { triggerChar: '$', items: [{ id: 'l-todo', text: 'Todo', labelColor: '#c0392b', groupBy: 'Status' }, { id: 'l-done', text: 'Done', labelColor: '#27ae60', groupBy: 'Status' }] };
  fontColorSettings = { default: '#ff0000', mode: 'Palette', columns: 5, modeSwitcher: false };
  backgroundColorSettings = { default: '#ffff00', mode: 'Palette', columns: 6, modeSwitcher: false };
  codeBlockSettings = { defaultLanguage: 'javascript', languages: [{ language: 'javascript', label: 'JavaScript' }, { language: 'plaintext', label: 'Plain' }] };

  users = [
    { id: 'u1', user: 'Ada Lovelace', avatarBgColor: '#8e44ad' },
    { id: 'u2', user: 'Alan Turing', avatarBgColor: '#2980b9' }
  ];
  collaborationSettings = { enableAwareness: true };

  pasteBlocks = [{ id: 'p-1', blockType: 'Paragraph', content: text('Paste here') }];
  pasteCleanupSettings = { plainText: false, keepFormat: true, deniedTags: ['script'], allowedStyles: ['color'] };

  imageBlocks = [{ id: 'i-1', blockType: 'Paragraph', content: text('Image upload target') }];
  imageBlockSettings = {
    saveUrl: '/api/blockeditor/upload', path: '/uploads/', maxFileSize: 500000, saveFormat: 'Blob',
    allowedTypes: ['.png', '.jpg'], width: 200, height: 'auto', enableResize: true,
    minWidth: 50, maxWidth: 400, minHeight: 20, maxHeight: 400
  };

  count(name: string) {
    this.counts[name]++;
  }

  onBlockChanged(event: CustomEvent) {
    this.count('blockChanged');
    const changes = event.detail.changes || [];
    this.lastAction = changes.length ? String(changes[0].action) : '';
  }

  replaceBlocks() {
    this.blocks = [
      { id: 'r-1', blockType: 'Heading', properties: { level: 2 }, content: text('Replaced heading') },
      { id: 'r-2', blockType: 'Paragraph', content: text('Replaced paragraph') }
    ] as any;
  }

  resize() {
    this.width = '420px';
    this.height = '200px';
    this.cssClass = 'be-second';
  }
}
