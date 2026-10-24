import { Gantt, GanttModel } from '@syncfusion/ej2-gantt';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("gantt")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-gantt')
export class Ej2Gantt extends SyncfusionWrapper<Gantt, GanttModel> {
  protected syncfusionWidgetType = Gantt;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
