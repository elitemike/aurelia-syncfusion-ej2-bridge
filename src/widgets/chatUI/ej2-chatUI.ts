import { ChatUI, ChatUIModel } from '@syncfusion/ej2-interactive-chat';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("chatUI")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chat-ui')
export class Ej2ChatUI extends SyncfusionWrapper<ChatUI, ChatUIModel> {
  protected syncfusionWidgetType = ChatUI;

  protected onBeforeWidgetInstantiation() {
    // the editor, mention and attachment parts derive their ids from the host id
    if (!this.widgetElement.id) {
      this.widgetElement.id = `chat-ui-${nextId++}`;
    }
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
