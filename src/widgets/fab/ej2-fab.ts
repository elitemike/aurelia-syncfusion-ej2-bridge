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
}
