import { QRCodeGenerator, QRCodeGeneratorModel } from '@syncfusion/ej2-barcode-generator';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("qrCodeGenerator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-qr-code-generator')
export class Ej2QRCodeGenerator extends SyncfusionWrapper<QRCodeGenerator, QRCodeGeneratorModel> {
  protected syncfusionWidgetType = QRCodeGenerator;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
