import { constants } from '../../common/constants';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("dialog")
@inlineView('<template><div element.ref="widgetElement"><slot></slot></div></template>')
@customElement('ej2-dialog')
export class Ej2Dialog extends SyncfusionWrapper<Dialog, DialogModel> {
  protected syncfusionWidgetType = Dialog;

  protected onWrapperCreated() {
  }

  private onOpen = () => { this[`${constants.bindablePrefix}visible`] = true; };
  private onClose = () => { this[`${constants.bindablePrefix}visible`] = false; };

  protected onWidgetCreated() {
    // keep the two-way `visible` binding in sync with user interaction (close icon, escape, overlay click, buttons)
    this.widget.addEventListener('open', this.onOpen);
    this.widget.addEventListener('close', this.onClose);
  }

  public detached() {
    this.widget?.removeEventListener('open', this.onOpen);
    this.widget?.removeEventListener('close', this.onClose);
    super.detached();
  }
}
