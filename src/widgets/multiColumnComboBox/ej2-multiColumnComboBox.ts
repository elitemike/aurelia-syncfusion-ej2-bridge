import { MultiColumnComboBox, MultiColumnComboBoxModel } from '@syncfusion/ej2-multicolumn-combobox';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("multiColumnComboBox")
@inlineView('<template><input element.ref="widgetElement" /></template>')
@customElement('ej2-multi-column-combo-box')
export class Ej2MultiColumnComboBox extends SyncfusionWrapper<MultiColumnComboBox, MultiColumnComboBoxModel> {
  protected syncfusionWidgetType = MultiColumnComboBox;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // A selection changes value, text and index together, bring all three bindings along. The widget finishes
    // updating them after it raised the event, so read them once the event has been processed.
    this.widget.addEventListener("change", () => {
      this.taskQueue.queueTask(() => {
        const widget: any = this.widget;
        if (!widget) {
          return;
        }
        this[`${constants.bindablePrefix}value`] = widget.value;
        this[`${constants.bindablePrefix}text`] = widget.text;
        this[`${constants.bindablePrefix}index`] = widget.index;
      });
    });
  }
}
