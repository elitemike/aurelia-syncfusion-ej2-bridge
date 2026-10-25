import { constants } from '../../common/constants';
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

  private syncSelection = () => {
    // selection happens inside the widget; mirror it to the two-way `selectedChips` binding
    const selected: any = this.widget?.selectedChips;
    this[`${constants.bindablePrefix}selectedChips`] = Array.isArray(selected) ? selected.slice() : selected;
  };

  protected onWidgetCreated() {
    // registered after the widget's own handlers, so the selection is already updated when these run
    this.widget.element.addEventListener('click', this.syncSelection);
    this.widget.element.addEventListener('keyup', this.syncSelection);
    this.widget.addEventListener('deleted', this.syncSelection);
  }

  public detached() {
    this.widget?.element?.removeEventListener('click', this.syncSelection);
    this.widget?.element?.removeEventListener('keyup', this.syncSelection);
    super.detached();
  }
}
