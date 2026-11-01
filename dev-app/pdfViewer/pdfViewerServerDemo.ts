import { samplePdf } from './samplePdf';
import { logEvent } from './pvLog';
import { Ej2PdfViewer } from 'widgets/pdfViewer/ej2-pdfViewer';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2PdfViewer)
export class PdfViewerServerDemo {
  viewer: any;
  log = (name: string, args?: any) => logEvent(`server.${name}`, args);
  documentPath = samplePdf;
  // the pdfium worker and WASM are copied next to the bundle by tools/copy-pdfium.js
  resourceUrl = `${location.origin}/scripts/ej2-pdfviewer-lib`;
  serviceUrl: any = "/pdfviewer-service/api/PdfViewer";
  serverActionSettings: any = {"load": "Load", "renderPages": "RenderPdfPages", "print": "PrintImages"};
  ajaxRequestSettings: any = {"ajaxHeaders": [{"headerName": "X-Demo", "headerValue": "1"}], "withCredentials": false};
  retryCount: any = 2;
  retryStatusCodes: any = [500, 503];
  retryTimeout: any = 1500;
  enableWebMcp: any = false;
  webMcpSettings: any = {"name": "demo-pdf", "tools": []};
}
