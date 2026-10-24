import { PDF417Generator, PDF417GeneratorModel } from '@syncfusion/ej2-barcode-generator';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("pdf417Generator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pdf417-generator')
export class Ej2PDF417Generator extends SyncfusionWrapper<PDF417Generator, PDF417GeneratorModel> {
  protected syncfusionWidgetType = PDF417Generator;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
