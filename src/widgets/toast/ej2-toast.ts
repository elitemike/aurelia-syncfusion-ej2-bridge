import { Toast, ToastModel } from '@syncfusion/ej2-notifications';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("toast")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-toast')
export class Ej2Toast extends SyncfusionWrapper<Toast, ToastModel> {
  protected syncfusionWidgetType = Toast;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
