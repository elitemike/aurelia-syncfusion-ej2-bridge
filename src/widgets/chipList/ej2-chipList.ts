import { ChipList, ChipListModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("chipList")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chip-list')
export class Ej2ChipList extends SyncfusionWrapper<ChipList, ChipListModel> {
  protected syncfusionWidgetType = ChipList;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
