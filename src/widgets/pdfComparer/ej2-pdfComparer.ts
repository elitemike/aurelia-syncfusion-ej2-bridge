import { PdfComparer, PdfComparerModel } from '@syncfusion/ej2-pdfviewer';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("pdfComparer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pdf-comparer')
export class Ej2PdfComparer extends SyncfusionWrapper<PdfComparer, PdfComparerModel> {
  protected syncfusionWidgetType = PdfComparer;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
