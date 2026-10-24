import { DataMatrixGenerator, DataMatrixGeneratorModel } from '@syncfusion/ej2-barcode-generator';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("dataMatrixGenerator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-data-matrix-generator')
export class Ej2DataMatrixGenerator extends SyncfusionWrapper<DataMatrixGenerator, DataMatrixGeneratorModel> {
  protected syncfusionWidgetType = DataMatrixGenerator;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
