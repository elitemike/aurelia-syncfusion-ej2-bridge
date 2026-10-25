import { Fab, FabModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("fab")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-fab')
export class Ej2Fab extends SyncfusionWrapper<Fab, FabModel> {
  protected syncfusionWidgetType = Fab;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  public detached() {
    // With a `target` the Fab moves its button into that element, Aurelia only removes the wrapper element, so take
    // the button out of the target ourselves or it would stay behind after the view is gone.
    const button = this.widgetElement;
    super.detached();
    if (button && button.parentNode && !this.element.contains(button)) {
      button.parentNode.removeChild(button);
    }
  }
}
