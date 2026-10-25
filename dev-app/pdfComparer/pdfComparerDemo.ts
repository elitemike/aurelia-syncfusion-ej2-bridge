import { samplePdf, modifiedSamplePdf } from '../pdfViewer/samplePdf';

export class PdfComparerDemo {
  comparer: any;
  originalDocumentPath = samplePdf;
  modifiedDocumentPath = modifiedSamplePdf;
  // the pdfium worker and WASM are copied next to the bundle by tools/copy-pdfium.js
  resourceUrl = `${location.origin}/scripts/ej2-pdfviewer-lib`;
  enableDifferencePanel = true;
  enableSyncScrolling = true;
  height = '520px';
  width = '100%';
  comparisonOptions = { beforeColor: '#ff0000', afterColor: '#00aa00', beforeColorOpacity: 0.4, afterColorOpacity: 0.4, enableHighlights: true };

  toggleDifferencePanel() { this.enableDifferencePanel = !this.enableDifferencePanel; }
  toggleSyncScrolling() { this.enableSyncScrolling = !this.enableSyncScrolling; }
  narrow() { this.width = '700px'; this.height = '400px'; }
  recolor() { this.comparisonOptions = { ...this.comparisonOptions, beforeColor: '#0000ff', enableHighlights: false }; }
}
