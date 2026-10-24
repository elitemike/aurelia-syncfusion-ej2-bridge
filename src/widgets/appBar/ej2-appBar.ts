import { AppBar, AppBarModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("appBar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-app-bar')
export class Ej2AppBar extends SyncfusionWrapper<AppBar, AppBarModel> {
  protected syncfusionWidgetType = AppBar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
