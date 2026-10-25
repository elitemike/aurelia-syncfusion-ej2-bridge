import { RecurrenceEditor, RecurrenceEditorModel } from '@syncfusion/ej2-schedule';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("recurrenceEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-recurrence-editor')
export class Ej2RecurrenceEditor extends SyncfusionWrapper<RecurrenceEditor, RecurrenceEditorModel> {
  protected syncfusionWidgetType = RecurrenceEditor;
  private onChange: (args: any) => void = null;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    this.onChange = (args: any) => {
      // the rule string is the editor value, keep the two-way binding in sync
      this[`${constants.bindablePrefix}value`] = args.value;
    };
    this.widget.addEventListener('change', this.onChange);
  }

  public detached() {
    if (this.widget && this.onChange) {
      this.widget.removeEventListener('change', this.onChange);
    }
    super.detached();
  }
}
