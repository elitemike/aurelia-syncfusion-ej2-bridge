import { samplePdf } from './samplePdf';
import { PLATFORM } from 'aurelia-pal';
import { logEvent } from './pvLog';
import { Ej2PdfViewer } from 'widgets/pdfViewer/ej2-pdfViewer';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2PdfViewer)
export class PdfViewerDemo {
  viewer: any;
  parts = [
    PLATFORM.moduleName('pdfViewer/pdfViewerFlagsDemo'),
    PLATFORM.moduleName('pdfViewer/pdfViewerAnnotationDemo'),
    PLATFORM.moduleName('pdfViewer/pdfViewerFormsDemo'),
    PLATFORM.moduleName('pdfViewer/pdfViewerServerDemo'),
    PLATFORM.moduleName('pdfViewer/pdfViewerUiDemo')
  ];
  documentPath = samplePdf;
  // the pdfium worker and WASM are copied next to the bundle by tools/copy-pdfium.js
  resourceUrl = `${location.origin}/scripts/ej2-pdfviewer-lib`;
  showToolbar = true;
  currentPage = 1;
  zoom = 100;
  pageCount = 0;
  edited = false;
  // Shift+G raises keyboardCustomCommands
  commandManager = { keyboardCommand: [{ name: 'demoCommand', gesture: { pdfKeys: 71, modifierKeys: 4 } }] };
  customMenu = [{ text: 'Demo action', id: 'demo_action' }];
  toolbarSettings = {
    showTooltip: true,
    toolbarItems: [
      'OpenOption', { id: 'demo_custom', text: 'Custom', tooltipText: 'Custom toolbar item', align: 'Left' },
      'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool',
      'SubmitForm', 'AnnotationEditTool', 'FormDesigner', 'SearchOption', 'PrintOption', 'DownloadOption'
    ]
  };

  log = (name: string, args?: any) => {
    if (name === 'hyperlinkClick' && args && args.detail) { args.detail.cancel = true; }
    logEvent(`main.${name}`, args);
  }

  next() { this.currentPage = this.currentPage + 1; }
}
