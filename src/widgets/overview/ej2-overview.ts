import { Overview, OverviewModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("overview")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-overview')
export class Ej2Overview extends SyncfusionWrapper<Overview, OverviewModel> {
  protected syncfusionWidgetType = Overview;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
