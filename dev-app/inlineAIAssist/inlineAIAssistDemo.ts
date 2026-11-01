import { Ej2InlineAIAssist } from 'widgets/inlineAIAssist/ej2-inlineAIAssist';
import { viewResources } from 'aurelia-framework';
const element = (className: string, text: string) => {
  const el = document.createElement('div');
  el.className = className;
  el.textContent = text;
  return [el];
};

@viewResources(Ej2InlineAIAssist)
export class InlineAIAssistDemo {
  defaultAssist: any;
  popupAssist: any;
  templateAssist: any;
  streamAssist: any;

  counts: { [key: string]: number } = { created: 0, open: 0, close: 0, promptRequest: 0 };
  requested = '';
  commandCount = 0;
  responseCount = 0;
  toolbarCount = 0;

  commandSettings = {
    popupWidth: '240px',
    popupHeight: '200px',
    commands: [
      { id: 'cmd-shorter', label: 'Make shorter', prompt: 'Make the text shorter', groupBy: 'Edit', iconCss: 'e-icons e-cut', tooltip: 'Shorten' },
      { id: 'cmd-formal', label: 'Make formal', prompt: 'Make the text formal', groupBy: 'Edit' }
    ],
    itemSelect: () => { this.commandCount++; }
  };
  responseSettings = {
    items: [{ id: 'resp-accept', label: 'Accept', iconCss: 'e-icons e-check' }, { id: 'resp-discard', label: 'Discard' }],
    itemSelect: () => { this.responseCount++; }
  };
  inlineToolbarSettings = {
    toolbarPosition: 'Bottom',
    items: [{ iconCss: 'e-icons e-plus', tooltip: 'Add', align: 'Left' }],
    itemClick: () => { this.toolbarCount++; }
  };
  prompts = [{ prompt: 'Earlier prompt', response: 'Earlier response' }];

  templatePrompts = [{ prompt: 'Templated prompt', response: 'Templated response' }];
  responseTemplate = (context: any) => element('ia-custom-response', `Response: ${context.response}`);
  editorTemplate = () => element('ia-custom-editor', 'Custom editor');

  speechToTextSettings = { enable: true, lang: 'en-US' };

  /** Select the target text (the command menu is positioned from the selection) and show the popup below it. */
  show(assist: any, targetId: string) {
    const target = document.getElementById(targetId);
    window.getSelection().selectAllChildren(target);
    const rect = target.getBoundingClientRect();
    assist.widget.showPopup(rect.left, rect.bottom + 10);
    // 35.1.40 mirrors the vertical position of the popup (top = -y - height), put it just below the target instead
    assist.widget.element.style.top = `${rect.bottom + 10}px`;
  }

  count(name: string) {
    this.counts[name]++;
  }

  onPromptRequest(event: CustomEvent) {
    this.count('promptRequest');
    this.requested = event.detail.prompt;
    setTimeout(() => this.defaultAssist.widget.addResponse(`Stub answer to: ${event.detail.prompt}`), 50);
  }

  onPopupRequest(event: CustomEvent) {
    setTimeout(() => this.popupAssist.widget.addResponse(`Popup answer to: ${event.detail.prompt}`), 50);
  }

  onTemplateRequest(event: CustomEvent) {
    setTimeout(() => this.templateAssist.widget.addResponse(`Templated answer to: ${event.detail.prompt}`), 50);
  }

  onStreamRequest(event: CustomEvent) {
    const chunks = ['First chunk. ', 'Second chunk. ', 'Final chunk.'];
    let text = '';
    chunks.forEach((chunk, index) => setTimeout(() => {
      text += chunk;
      this.streamAssist.widget.addResponse(text, index === chunks.length - 1);
    }, 100 * (index + 1)));
  }
}
