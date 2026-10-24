import { Kanban, KanbanModel } from '@syncfusion/ej2-kanban';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("kanban")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-kanban')
export class Ej2Kanban extends SyncfusionWrapper<Kanban, KanbanModel> {
  protected syncfusionWidgetType = Kanban;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
