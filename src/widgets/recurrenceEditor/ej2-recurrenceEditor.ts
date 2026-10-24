import { RecurrenceEditor, RecurrenceEditorModel } from '@syncfusion/ej2-schedule';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("recurrenceEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-recurrence-editor')
export class Ej2RecurrenceEditor extends SyncfusionWrapper<RecurrenceEditor, RecurrenceEditorModel> {
  protected syncfusionWidgetType = RecurrenceEditor;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
