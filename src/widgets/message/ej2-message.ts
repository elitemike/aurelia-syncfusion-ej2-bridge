import { constants } from '../../common/constants';
import { Message, MessageModel } from '@syncfusion/ej2-notifications';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("message")
@inlineView('<template><div element.ref="widgetElement"><slot></slot></div></template>')
@customElement('ej2-message')
export class Ej2Message extends SyncfusionWrapper<Message, MessageModel> {
  protected syncfusionWidgetType = Message;

  protected onWrapperCreated() {
  }

  private onClosed = () => { this[`${constants.bindablePrefix}visible`] = false; };

  protected onWidgetCreated() {
    this.widget.addEventListener('closed', this.onClosed);
  }

  public detached() {
    this.widget?.removeEventListener('closed', this.onClosed);
    super.detached();
  }
}
