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
  }

  protected onWidgetCreated() {
  }
}
