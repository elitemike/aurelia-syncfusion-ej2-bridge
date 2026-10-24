import { Signature, SignatureModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("signature")
@inlineView('<template><canvas element.ref="widgetElement"></canvas></template>')
@customElement('ej2-signature')
export class Ej2Signature extends SyncfusionWrapper<Signature, SignatureModel> {
  protected syncfusionWidgetType = Signature;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
