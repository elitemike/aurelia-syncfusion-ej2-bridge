import { SpeedDial, SpeedDialModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("speedDial")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-speed-dial')
export class Ej2SpeedDial extends SyncfusionWrapper<SpeedDial, SpeedDialModel> {
  protected syncfusionWidgetType = SpeedDial;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  public detached() {
    // The speed dial moves its button and its popup into the `target` (or body). Aurelia only removes the wrapper
    // element, so clean up what the widget left outside of it.
    const button = this.widgetElement;
    const popupId = button && button.id ? `${button.id}_popup` : null;
    super.detached();
    [button, popupId ? document.getElementById(popupId) : null].forEach(node => {
      if (node && node.parentNode && !this.element.contains(node)) {
        node.parentNode.removeChild(node);
      }
    });
  }
}
