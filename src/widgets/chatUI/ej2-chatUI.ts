
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { ChatUI, ChatUIModel } from '@syncfusion/ej2/interactive-chat';


@generateBindables("chatUI")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chat-ui')
export class Ej2ChatUI extends SyncfusionWrapper<ChatUI, ChatUIModel> {
  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {

  }

  protected syncfusionWidgetType = ChatUI

  public refresh() {
    this.widget.refresh();
  }

  public dataBind() {
    this.widget.dataBind();
  }

  public detached() {
  }
}
