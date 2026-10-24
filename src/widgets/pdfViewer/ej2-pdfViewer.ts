import { PdfViewer, PdfViewerModel } from '@syncfusion/ej2-pdfviewer';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("pdfViewer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pdf-viewer')
export class Ej2PdfViewer extends SyncfusionWrapper<PdfViewer, PdfViewerModel> {
  protected syncfusionWidgetType = PdfViewer;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
