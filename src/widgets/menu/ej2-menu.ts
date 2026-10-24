import { Menu, MenuModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("menu")
@inlineView('<template><ul element.ref="widgetElement"></ul></template>')
@customElement('ej2-menu')
export class Ej2Menu extends SyncfusionWrapper<Menu, MenuModel> {
  protected syncfusionWidgetType = Menu;

  protected onWrapperCreated() {
    // The menu measures its parent to decide whether enableScrolling needs scroll buttons. A custom element is
    // inline by default and would grow with the items, so make the host a block that takes the available width.
    (this.element as HTMLElement).style.display = 'block';
  }

  protected onWidgetCreated() {
  }
}
