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
}
