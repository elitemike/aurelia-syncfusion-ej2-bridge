import { ContextMenu, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("contextMenu")
@inlineView('<template><ul element.ref="widgetElement"></ul></template>')
@customElement('ej2-context-menu')
export class Ej2ContextMenu extends SyncfusionWrapper<ContextMenu, ContextMenuModel> {
  protected syncfusionWidgetType = ContextMenu;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  protected appendWidget() {
    // ContextMenu.destroy replaces the original list with a rebuilt one. When the view is reused (if.bind) or the
    // widget is recreated the element reference points to the detached original, so pick up the list in the host.
    if (this.widgetElement && !this.widgetElement.isConnected) {
      const list = this.element.querySelector('ul');
      if (list) {
        this.widgetElement = list as HTMLElement;
      }
    }
    super.appendWidget();
  }
}
