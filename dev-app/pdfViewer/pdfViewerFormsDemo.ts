import { samplePdf } from './samplePdf';

export class PdfViewerFormsDemo {
  viewer: any;
  documentPath = samplePdf;
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
  formFieldCollections: any = [{"name": "declared", "type": "Textbox", "pageNumber": 1, "bounds": {"X": 100, "Y": 100, "Width": 120, "Height": 24}}];
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
