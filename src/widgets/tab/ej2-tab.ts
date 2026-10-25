import { Tab, TabModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("tab")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tab')
export class Ej2Tab extends SyncfusionWrapper<Tab, TabModel> {
  protected syncfusionWidgetType = Tab;
  private onSelected: (args: any) => void = null;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // the selected tab changes through clicks, keyboard and select(), write it back to the binding
    this.onSelected = (args) => {
      this[`${constants.bindablePrefix}selectedItem`] = args.selectedIndex;
    };
    this.widget.addEventListener('selected', this.onSelected);
  }

  public detached() {
    if (this.widget) {
      this.widget.removeEventListener('selected', this.onSelected);
    }
    super.detached();
  }
}
