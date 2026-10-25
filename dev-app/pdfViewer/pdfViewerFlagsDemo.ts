import { samplePdf } from './samplePdf';

export class PdfViewerFlagsDemo {
  viewer: any;
  documentPath = samplePdf;
  // the pdfium worker and WASM are copied next to the bundle by tools/copy-pdfium.js
  resourceUrl = `${location.origin}/scripts/ej2-pdfviewer-lib`;
  enableToolbar: any = false;
  enableNavigationToolbar: any = false;
  enableThumbnail: any = false;
  enableBookmark: any = false;
  enableHyperlink: any = false;
  enableNavigation: any = false;
  enableMagnification: any = false;
  enableTextSelection: any = false;
  enableTextSearch: any = false;
  enableDownload: any = false;
  enablePrint: any = false;
  enableAnnotation: any = false;
  enableFormFields: any = false;
  enableFormDesigner: any = false;
  enableAnnotationToolbar: any = false;
  enableCommentPanel: any = false;
  enableLinkAnnotation: any = false;
  enableRedactionToolbar: any = false;
  enableFormDesignerToolbar: any = false;
  enablePageOrganizer: any = false;
  enableAutoComplete: any = false;
}
