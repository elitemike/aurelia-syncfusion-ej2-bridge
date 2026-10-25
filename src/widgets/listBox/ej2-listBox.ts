import { ListBox, ListBoxModel, ListBoxChangeEventArgs, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("listBox")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-list-box')
export class Ej2ListBox extends SyncfusionWrapper<ListBox, ListBoxModel> {
  protected syncfusionWidgetType = ListBox;

  protected onBeforeWidgetInstantiation() {
    // selectionSettings.showCheckbox needs the check box module
    ListBox.Inject(CheckBoxSelection);
  }

  protected onWrapperCreated() {
    // Other list boxes address this one through `scope="#id"` (drag and drop, toolbar moves), so the id of the
    // host has to live on the element the widget renders from.
    const id = this.element.getAttribute("id");
    if (id) {
      this.element.removeAttribute("id");
      this.widgetElement.setAttribute("id", id);
    }
  }

  protected onWidgetCreated() {
    this.widget.addEventListener("change", (args: ListBoxChangeEventArgs) => {
      // the widget may hand back the array it keeps mutating, which Aurelia's observer would ignore
      const value = (<any>this.widget).value;
      this[`${constants.bindablePrefix}value`] = Array.isArray(value) ? value.slice() : value;
    });
  }
}
