const element = (className: string, text: string) => {
  const el = document.createElement('div');
  el.className = className;
  el.textContent = text;
  return [el];
};

export class AIAssistViewDemo {
  assist: any;
  templatedAssist: any;
  streamAssist: any;

  counts: { [key: string]: number } = {
    created: 0, promptRequest: 0, promptChanged: 0, stopRespondingClick: 0, streamStop: 0,
    beforeAttachmentUpload: 0, attachmentUploadSuccess: 0, attachmentUploadFailure: 0, attachmentRemoving: 0,
    attachmentRemoved: 0, mentionSelect: 0, editableContextClicked: 0
  };
  requested = '';
  changed = '';
  mentioned = '';
  contextName = '';
  holdResponse = false;
  toolbarClicks = 0;
  responseClicks = 0;

  prompts: any[] = [];
  suggestions = ['What can you do?', 'Summarize this page', 'Tell me a joke'];

  showHeader = true;
  prompt = '';
  activeView = 0;
  views = [
    { type: 'Assist', name: 'Assistant', iconCss: 'e-icons e-assistview-icon' },
    { type: 'Custom', name: 'Custom view', iconCss: 'e-icons e-settings', viewTemplate: () => element('ai-custom-view', 'Custom view content') }
  ];
  toolbarSettings = {
    items: [{ iconCss: 'e-icons e-refresh', align: 'Right', tooltip: 'Refresh' }],
    itemClicked: () => { this.toolbarClicks++; }
  };
  promptToolbarSettings = { width: '120px', items: [{ iconCss: 'e-icons e-edit', tooltip: 'Edit prompt' }] };
  responseToolbarSettings = {
    width: '180px',
    items: [{ iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }, { iconCss: 'e-icons e-assist-like', tooltip: 'Like' }],
    itemClicked: () => { this.responseClicks++; }
  };
  footerToolbarSettings = { toolbarPosition: 'Top', items: [{ iconCss: 'e-icons e-plus', tooltip: 'More', align: 'Left' }] };
  lookPrompts = [{ prompt: 'Hello assistant', response: 'Hello, how can I help you today?' }];

  templatePrompts = [{ prompt: 'Templated prompt', response: 'Templated response' }];
  bannerTemplate = () => element('ai-custom-banner', 'Custom banner');
  footerTemplate = () => element('ai-custom-footer', 'Custom footer');
  promptItemTemplate = (context: any) => element('ai-custom-prompt', `Q: ${context.prompt}`);
  responseItemTemplate = (context: any) => element('ai-custom-response', `A: ${context.response}`);
  suggestionItemTemplate = (context: any) => element('ai-custom-suggestion', String(context.promptSuggestion));
  animationTemplate = () => element('ai-custom-animation', 'Thinking...');
  blockTemplate = () => element('ai-custom-block', 'Block');
  itemTemplate = () => element('ai-custom-item', 'Item');

  attachmentSettings = {
    saveUrl: '/api/ai/upload', removeUrl: '/api/ai/remove', allowedFileTypes: '.png,.txt', maxFileSize: 500000, maximumCount: 3
  };

  mentions = [{
    mentionChar: '@', dataSource: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }], fields: { text: 'name', value: 'name' }, displayTemplate: '<span class="ai-mention-chip">@${name}</span>', highlight: true, showMentionChar: true,
    popupWidth: '240px', popupHeight: '180px', filterType: 'StartsWith'
  }];

  speechToTextSettings = { enable: true, lang: 'en-US', allowInterimResults: true, showTooltip: true };
  textToSpeechSettings = { language: 'en-US', speechPitch: 1, speechRate: 1, volume: 1 };
  telemetrySettings = { enable: false };
  thinkingPrompts = [{
    prompt: 'Why is the sky blue?',
    response: 'Rayleigh scattering.',
    blocks: [{
      blockType: 'thinking', id: 'think-1', title: 'Thinking', isActive: false, collapsible: true, collapsed: false,
      stages: [{
        id: 'stage-1', status: 'completed', content: 'Looked up the topic',
        editableContext: [{ type: 'search', name: 'physics', value: 'physics', clickable: true, tooltipText: 'Edit context' }]
      }]
    }, { blockType: 'text', content: 'Rayleigh scattering.' }]
  }];

  count(name: string) {
    this.counts[name]++;
  }

  onPromptRequest(event: CustomEvent) {
    this.count('promptRequest');
    this.requested = event.detail.prompt;
    if (!this.holdResponse) {
      setTimeout(() => this.assist.widget.addPromptResponse(`Stub answer to: ${event.detail.prompt}`), 50);
    }
  }

  onStreamRequest(event: CustomEvent) {
    const chunks = ['First chunk. ', 'Second chunk. ', 'Final chunk.'];
    let text = '';
    chunks.forEach((chunk, index) => setTimeout(() => {
      text += chunk;
      this.streamAssist.widget.addPromptResponse(text, index === chunks.length - 1);
    }, 100 * (index + 1)));
  }

  onPromptChanged(event: CustomEvent) {
    this.count('promptChanged');
    this.changed = event.detail.value;
  }

  onMentionSelect(event: CustomEvent) {
    this.count('mentionSelect');
    this.mentioned = event.detail.itemData ? String(event.detail.itemData.name) : '';
  }

  onContextClicked(event: CustomEvent) {
    this.count('editableContextClicked');
    this.contextName = event.detail.contextItem ? event.detail.contextItem.name : '';
  }
}
