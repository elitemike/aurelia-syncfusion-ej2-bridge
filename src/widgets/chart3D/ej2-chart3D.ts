import { Chart3D, Chart3DModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("chart3D")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chart3d')
export class Ej2Chart3D extends SyncfusionWrapper<Chart3D, Chart3DModel> {
  protected syncfusionWidgetType = Chart3D;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
