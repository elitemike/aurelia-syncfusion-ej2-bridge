import { CircularChart3D, CircularChart3DModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("circularChart3D")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-circular-chart3d')
export class Ej2CircularChart3D extends SyncfusionWrapper<CircularChart3D, CircularChart3DModel> {
  protected syncfusionWidgetType = CircularChart3D;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
