export class FormRendererDemo {
  counts: { [key: string]: number } = { created: 0, change: 0, submit: 0, buttonClick: 0, failure: 0 };
  changeField = '';
  changeValue = '';
  submitValid = '';
  submitData = '';
  buttonField = '';
  layout = 'SingleColumn';

  schema = {
    version: '1.0',
    properties: {
      fullName: { id: 'fullName', name: 'fullName', type: 'string', widget: 'textbox', label: 'Full name', required: true, placeholder: 'Your name' },
      age: { id: 'age', name: 'age', type: 'number', widget: 'number', label: 'Age', minValue: 0, maxValue: 120 },
      country: { id: 'country', name: 'country', type: 'string', widget: 'dropdown', label: 'Country', options: ['Austria', 'Brazil', 'Canada'] },
      newsletter: { id: 'newsletter', name: 'newsletter', type: 'boolean', widget: 'checkbox', label: 'Newsletter' },
      help: { id: 'help', name: 'help', type: 'button', widget: 'button', label: 'Help', buttonType: 'button' },
      send: { id: 'send', name: 'send', type: 'button', widget: 'button', label: 'Send', buttonType: 'submit', style: 'primary' }
    },
    layout: [
      { type: 'field', propertyId: 'fullName' },
      { type: 'field', propertyId: 'age' },
      { type: 'field', propertyId: 'country' },
      { type: 'field', propertyId: 'newsletter' },
      { type: 'field', propertyId: 'help' },
      { type: 'field', propertyId: 'send' }
    ],
    settings: { name: 'demo-form' }
  };
  dataModel: any = { fullName: 'Grace Hopper', age: 85, country: 'Brazil', newsletter: true };

  customSchema = {
    version: '1.0',
    properties: {
      nickname: { id: 'nickname', name: 'nickname', type: 'string', widget: 'textbox', label: 'Nickname' }
    },
    layout: [{ type: 'field', propertyId: 'nickname' }]
  };
  customWidgetSettings = [
    { fieldName: 'nickname', type: 'textbox', template: '<div class="fr-custom-widget"><b>Custom</b> nickname editor</div>' }
  ];

  htmlSchema = {
    version: '1.0',
    properties: {
      note: { id: 'note', name: 'note', type: 'string', widget: 'staticHtml', defaultValue: '<p class="fr-note">Safe <b>text</b></p><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" onerror="window.__frHacked=1"><script>window.__frHacked=1</script>' }
    },
    layout: [{ type: 'field', propertyId: 'note' }]
  };

  count(name: string) {
    this.counts[name]++;
  }

  onChange(event: CustomEvent) {
    this.count('change');
    this.changeField = event.detail.fieldName;
    this.changeValue = String(event.detail.value);
  }

  onSubmit(event: CustomEvent) {
    this.count('submit');
    this.submitValid = String(event.detail.isValid);
    this.submitData = JSON.stringify(event.detail.data);
  }

  onButtonClick(event: CustomEvent) {
    this.count('buttonClick');
    this.buttonField = event.detail.fieldName;
  }

  onFailure(event: CustomEvent) {
    this.count('failure');
  }

  newData() {
    this.dataModel = { fullName: 'Ada Lovelace', age: 36, country: 'Austria', newsletter: false };
  }
}
