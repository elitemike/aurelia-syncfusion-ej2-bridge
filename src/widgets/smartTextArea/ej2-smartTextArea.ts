import { SmartTextArea, SmartTextAreaModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("smartTextArea")
@inlineView('<template><textarea element.ref="widgetElement"></textarea></template>')
@customElement('ej2-smart-text-area')
export class Ej2SmartTextArea extends SyncfusionWrapper<SmartTextArea, SmartTextAreaModel> {
  protected syncfusionWidgetType = SmartTextArea;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    this.widget.addEventListener("input", (args: any) => {
      this[`${constants.bindablePrefix}value`] = args.value !== undefined ? args.value : (<any>this.widget).element.value;
    });
    // an accepted inline suggestion is written into the textarea without an `input` event, bring the binding along
    this.widget.addEventListener("afterSuggestionInsert", () => {
      const element = (<any>this.widget).element as HTMLTextAreaElement;
      if (element) {
        this[`${constants.bindablePrefix}value`] = element.value;
      }
    });
  }

  valueChanged(newValue) {
    const latest = this[`${constants.bindablePrefix}value`];
    if (latest === (<any>this.widget).value) {
      return;
    }
    if (this.widget.element && (<any>this.widget.element).value === latest) {
      this.widget.setProperties({ value: latest }, true);
    } else {
      this.widget.value = latest;
    }
  }
}
