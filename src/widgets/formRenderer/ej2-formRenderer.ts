import { FormRenderer, FormRendererModel } from '@syncfusion/ej2-form-renderer';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("formRenderer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-form-renderer')
export class Ej2FormRenderer extends SyncfusionWrapper<FormRenderer, FormRendererModel> {
  protected syncfusionWidgetType = FormRenderer;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
