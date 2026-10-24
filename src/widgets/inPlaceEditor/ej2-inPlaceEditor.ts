import { InPlaceEditor, InPlaceEditorModel } from '@syncfusion/ej2-inplace-editor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("inPlaceEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-in-place-editor')
export class Ej2InPlaceEditor extends SyncfusionWrapper<InPlaceEditor, InPlaceEditorModel> {
  protected syncfusionWidgetType = InPlaceEditor;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
