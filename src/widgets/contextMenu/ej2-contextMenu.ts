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
}
