import { BarcodeGenerator, BarcodeGeneratorModel } from '@syncfusion/ej2-barcode-generator';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("barcodeGenerator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-barcode-generator')
export class Ej2BarcodeGenerator extends SyncfusionWrapper<BarcodeGenerator, BarcodeGeneratorModel> {
  protected syncfusionWidgetType = BarcodeGenerator;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
