import { FormBuilder, FormBuilderModel } from '@syncfusion/ej2-form-builder';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("formBuilder")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-form-builder')
export class Ej2FormBuilder extends SyncfusionWrapper<FormBuilder, FormBuilderModel> {
  protected syncfusionWidgetType = FormBuilder;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
