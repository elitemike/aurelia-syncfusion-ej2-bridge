import { Message, MessageModel } from '@syncfusion/ej2-notifications';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("message")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-message')
export class Ej2Message extends SyncfusionWrapper<Message, MessageModel> {
  protected syncfusionWidgetType = Message;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
