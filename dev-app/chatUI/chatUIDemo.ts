import { Ej2ChatUI } from 'widgets/chatUI/ej2-chatUI';
import { viewResources } from 'aurelia-framework';
const today = new Date();
const at = (hour: number, minute: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
const yesterday = (hour: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, hour, 0);

@viewResources(Ej2ChatUI)
export class ChatUIDemo {
  counts: { [key: string]: number } = {
    created: 0, messageSend: 0, userTyping: 0, mentionSelect: 0, beforeAttachmentUpload: 0,
    attachmentUploadSuccess: 0, attachmentUploadFailure: 0, attachmentRemoved: 0
  };
  sentText = '';
  typingText = '';
  mentioned = '';
  toolbarClicks = 0;

  currentUser = { id: 'user1', user: 'Alice Cooper', avatarBgColor: '#87cefa' };
  michale = { id: 'user2', user: 'Michale Suyama', avatarBgColor: '#c8b4f5' };
  users = [
    { id: 'user1', user: 'Alice Cooper', avatarBgColor: '#87cefa' },
    { id: 'user2', user: 'Michale Suyama', avatarBgColor: '#c8b4f5' },
    { id: 'user3', user: 'Reena Jones', avatarBgColor: '#f5c8b4' }
  ];

  messages = [
    { id: 'm1', text: 'Hi Michale, are we meeting today?', author: this.currentUser, timeStamp: yesterday(9) },
    { id: 'm2', text: 'Yes, at 3 PM in the conference room.', author: this.michale, timeStamp: yesterday(10) },
    { id: 'm3', text: 'Great, I will bring the slides.', author: this.currentUser, timeStamp: at(8, 30) },
    { id: 'm4', text: 'Perfect, see you then.', author: this.michale, timeStamp: at(8, 45) }
  ];
  appearanceMessages = this.messages.map(m => ({ ...m }));
  shortMessages = [{ id: 's1', text: 'Hello there', author: this.michale, timeStamp: at(9, 0) }];
  templateMessages = [
    { id: 't1', text: 'Template message one', author: this.michale, timeStamp: yesterday(9) },
    { id: 't2', text: 'Template message two', author: this.currentUser, timeStamp: at(9, 5) }
  ];

  showHeader = true;
  showFooter = true;
  compact = false;
  showTimeStamp = true;
  headerToolbar = {
    items: [{ iconCss: 'e-icons e-refresh', align: 'Right', tooltip: 'Refresh' }],
    itemClicked: () => { this.toolbarClicks++; }
  };
  messageToolbarSettings = {
    width: 160,
    items: [{ iconCss: 'e-icons e-reply', tooltip: 'Reply' }, { iconCss: 'e-icons e-copy', tooltip: 'Copy' }]
  };

  suggestions = ['Looks good to me', 'Can we reschedule?', 'Thanks!'];
  typingUsers = [this.michale];

  // string templates are inserted as plain html, the functions receive the context of the item
  messageTemplate = (context: any) => {
    const element = document.createElement('div');
    element.className = 'chat-custom-message';
    element.textContent = context.message.text;
    return [element];
  };
  suggestionTemplate = (context: any) => {
    const element = document.createElement('div');
    element.className = 'chat-custom-suggestion';
    element.textContent = context.suggestion;
    return [element];
  };
  footerTemplate = '<div class="chat-custom-footer">Custom footer</div>';
  timeBreakTemplate = '<div class="chat-custom-timebreak">Day separator</div>';
  typingTemplate = '<div class="chat-custom-typing">Someone is typing</div>';
  emptyTemplate = '<div class="chat-custom-empty">Nothing here yet</div>';

  attachmentSettings = {
    saveUrl: '/api/chat/upload', removeUrl: '/api/chat/remove', path: '/uploads/', saveFormat: 'Blob',
    allowedFileTypes: '.png,.txt', maxFileSize: 500000, enableDragAndDrop: true, maximumCount: 3
  };

  count(name: string) {
    this.counts[name]++;
  }

  onMessageSend(event: CustomEvent) {
    this.count('messageSend');
    this.sentText = event.detail.message.text;
  }

  onUserTyping(event: CustomEvent) {
    this.count('userTyping');
    this.typingText = event.detail.message;
  }

  onMentionSelect(event: CustomEvent) {
    this.count('mentionSelect');
    this.mentioned = event.detail.itemData ? event.detail.itemData.user : '';
  }
}
