import { TextArea, TextAreaModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("textArea")
@inlineView('<template><textarea element.ref="widgetElement"></textarea></template>')
@customElement('ej2-text-area')
export class Ej2TextArea extends SyncfusionWrapper<TextArea, TextAreaModel> {
  protected syncfusionWidgetType = TextArea;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // `input` is raised on every keystroke, `change` only when the box is committed. Keep the binding live.
    this.widget.addEventListener("input", (args: any) => {
      this[`${constants.bindablePrefix}value`] = args.value !== undefined ? args.value : (<any>this.widget).element.value;
    });
  }

  valueChanged(newValue) {
    const latest = this[`${constants.bindablePrefix}value`];
    if (latest === (<any>this.widget).value) {
      return;
    }
    if (this.widget.element && (<any>this.widget.element).value === latest) {
      // typed, the textarea already shows it. Sync the widget without raising a `change` per keystroke.
      this.widget.setProperties({ value: latest }, true);
    } else {
      this.widget.value = latest;
    }
  }
}
