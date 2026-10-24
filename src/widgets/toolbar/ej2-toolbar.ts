import { Toolbar, ToolbarModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("toolbar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-toolbar')
export class Ej2Toolbar extends SyncfusionWrapper<Toolbar, ToolbarModel> {
  protected syncfusionWidgetType = Toolbar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
