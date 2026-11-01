import { formPdf } from './samplePdf';
import { logEvent } from './pvLog';
import { Ej2PdfViewer } from 'widgets/pdfViewer/ej2-pdfViewer';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2PdfViewer)
export class PdfViewerFormsDemo {
  viewer: any;
  log = (name: string, args?: any) => logEvent(`forms.${name}`, args);
  documentPath = formPdf;
  // the pdfium worker and WASM are copied next to the bundle by tools/copy-pdfium.js
  resourceUrl = `${location.origin}/scripts/ej2-pdfviewer-lib`;
  enableFormFields: any = true;
  enableFormDesigner: any = true;
  enableFormDesignerToolbar: any = true;
  isFormDesignerToolbarVisible: any = true;
  designerMode: any = true;
  enableFormFieldsValidation: any = true;
  isFormFieldDocument: any = false;
  isInitialFieldToolbarSelection: any = true;
  isSignatureEditable: any = true;
  hideSaveSignature: any = true;
  signatureFitMode: any = "Fill";
  hideEmptyDigitalSignatureFields: any = true;
  showDigitalSignatureAppearance: any = true;
  formFieldCollections: any = [{"name": "declared", "type": "Textbox", "value": "hello", "pageNumber": 1, "bounds": {"X": 100, "Y": 100, "Width": 120, "Height": 24}}, {"name": "go", "type": "Button", "value": "Go", "fontFamily": "Helvetica", "fontSize": 12, "pageNumber": 1, "bounds": {"X": 300, "Y": 100, "Width": 100, "Height": 30}}];
  formFields: any = [];
  signatureFieldSettings: any = {"name": "sig", "tooltip": "Sign here", "thickness": 2};
  initialFieldSettings: any = {"name": "init", "tooltip": "Initial here"};
  signatureDialogSettings: any = {"displayMode": 3, "hideSaveSignature": true};
  initialDialogSettings: any = {"displayMode": 5, "hideSaveSignature": false};
  textFieldSettings: any = {"name": "tf", "fontSize": 13, "tooltip": "Text field"};
  passwordFieldSettings: any = {"name": "pw", "maxLength": 12};
  checkBoxFieldSettings: any = {"name": "cb", "isChecked": true};
  radioButtonFieldSettings: any = {"name": "rb", "isSelected": true};
  DropdownFieldSettings: any = {"name": "dd", "options": [{"itemName": "A", "itemValue": "a"}]};
  listBoxFieldSettings: any = {"name": "lb", "options": [{"itemName": "B", "itemValue": "b"}]};
}
