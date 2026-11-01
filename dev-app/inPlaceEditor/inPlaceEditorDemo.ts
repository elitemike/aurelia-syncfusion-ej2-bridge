import { Ej2InPlaceEditor } from 'widgets/inPlaceEditor/ej2-inPlaceEditor';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2InPlaceEditor)
export class InPlaceEditorDemo {
  name = 'Andrew';
  textModel = { placeholder: 'Enter value' };

  numeric = 25;
  numericModel = { min: 0, max: 100, step: 5, format: 'n0' };
  maskModel = { mask: '(999) 999-9999' };
  date = new Date(2024, 4, 15, 10, 30);
  dateModel = { format: 'dd/MM/yyyy' };
  dateTimeModel = { format: 'dd/MM/yyyy HH:mm' };
  sport = 'Football';
  sportData = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
  dropDownModel = { dataSource: this.sportData, placeholder: 'Select a sport' };
  autoCompleteModel = { dataSource: this.sportData, placeholder: 'Type a sport' };
  comboModel = { dataSource: this.sportData, placeholder: 'Select or type' };
  sports = ['Cricket', 'Golf'];
  multiModel = { dataSource: this.sportData, placeholder: 'Select sports' };
  colorModel = { mode: 'Palette' };
  sliderModel = { min: 0, max: 100, step: 10 };
  time = new Date(2024, 0, 1, 9, 0);
  timeModel = { format: 'HH:mm' };
  dateRange = [new Date(2024, 4, 1), new Date(2024, 4, 10)];
  dateRangeModel = { format: 'dd/MM/yyyy' };
  rteModel = { toolbarSettings: { items: ['Bold', 'Italic', 'Underline'] } };

  popupSettings = { title: 'Enter the name' };

  saveButton = { content: 'Apply', cssClass: 'ipe-save' };
  cancelButton = { content: 'Discard', cssClass: 'ipe-cancel' };
  blurValue = 'Blur to submit';
  editMode = false;

  validationRules = { Required: { required: [true, 'This field is required'] } };
  validatingCount = 0;
  validatingMessage = '';

  showServer = true;
  counts: { [key: string]: number } = {
    created: 0, destroyed: 0, beginEdit: 0, endEdit: 0, change: 0, submitClick: 0, cancelClick: 0,
    actionBegin: 0, actionSuccess: 0, actionFailure: 0
  };
  endAction = '';
  changeValue = '';
  changePrevious = '';
  beginKey = '';
  successValue = '';

  sanitizeCount = 0;
  template = '<div class="ipe-template"><input type="text" name="Template" class="e-input ipe-template-input" placeholder="Template input" /></div>';

  count(name: string) {
    this.counts[name]++;
  }

  onEndEdit(event: CustomEvent) {
    this.count('endEdit');
    this.endAction = event.detail.action;
  }

  onChange(event: CustomEvent) {
    this.count('change');
    this.changeValue = String(event.detail.value);
    this.changePrevious = String(event.detail.previousValue);
  }

  onActionBegin(event: CustomEvent) {
    this.count('actionBegin');
    this.beginKey = Object.keys(event.detail.data).join(',');
  }

  onActionSuccess(event: CustomEvent) {
    this.count('actionSuccess');
    this.successValue = String(event.detail.value);
  }

  onValidating(event: CustomEvent) {
    this.validatingCount++;
    this.validatingMessage = event.detail.errorMessage;
  }

  onTemplateBegin(event: CustomEvent) {
    // a template editor is not read by the control, hand the typed text over as the submitted value
    const input = document.querySelector('.ipe-template-input') as HTMLInputElement;
    event.detail.data.value = input.value;
  }

  onTemplateSuccess(event: CustomEvent) {
    // the displayed text is whatever actionSuccess leaves in args.value
    event.detail.value = `${event.detail.value} (template)`;
  }

  onBeforeSanitize() {
    this.sanitizeCount++;
  }
}
