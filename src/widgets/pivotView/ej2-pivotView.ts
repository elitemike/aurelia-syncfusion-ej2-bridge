import { PivotView, PivotViewModel } from '@syncfusion/ej2-pivotview';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("pivotView")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pivot-view')
export class Ej2PivotView extends SyncfusionWrapper<PivotView, PivotViewModel> {
  protected syncfusionWidgetType = PivotView;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
