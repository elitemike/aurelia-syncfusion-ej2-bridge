import { TextArea, TextAreaModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("textArea")
@inlineView('<template><textarea element.ref="widgetElement"></textarea></template>')
@customElement('ej2-text-area')
export class Ej2TextArea extends SyncfusionWrapper<TextArea, TextAreaModel> {
  protected syncfusionWidgetType = TextArea;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
