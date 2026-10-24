export class SmartTextAreaDemo {
  value = '';
  popupValue = '';
  popupMode = 'Enable';
  phrases = ['Thank you for contacting us', 'We will get back to you soon'];
  calls = 0;
  lastPrompt: any = null;
  cancel = false;
  beforeText = '';
  afterText = '';
  inputCount = 0;
  focused = false;
  changeCount = 0;

  readonly = true;
  enabled = true;
  cssClass = 'sta-custom';
  htmlAttrs = { 'data-foo': 'bar' };
  width = '300px';
  resizeMode = 'Vertical';
  maxLength = 20;
  cols = 30;
  rows = 2;
  prepend = '<span class="sta-prepend">pre</span>';
  append = '<span class="sta-append">app</span>';
  flow = 'Horizontal';
  orientation = 'Horizontal';

  showBox = true;
  createdCount = 0;
  destroyedCount = 0;

  /** Stands in for the AI service, answers with the Syncfusion "OK:[...]" prediction format. */
  handler = async (prompt: any) => {
    this.calls++;
    this.lastPrompt = prompt;
    (<any>window).smartTextAreaPrompt = prompt;
    return 'OK:[ is the answer.]';
  };

  onBefore(event: CustomEvent) {
    this.beforeText = event.detail.text;
    if (this.cancel) {
      event.detail.cancel = true;
    }
  }

  onAfter(event: CustomEvent) {
    this.afterText = event.detail.insertedText;
  }

  change() {
    this.readonly = false;
    this.enabled = false;
    this.cssClass = 'sta-custom-two';
    this.htmlAttrs = { 'data-foo': 'baz' };
    this.width = '400px';
    this.resizeMode = 'Horizontal';
    this.maxLength = 10;
    this.cols = 40;
    this.rows = 5;
    this.flow = 'Vertical';
    this.orientation = 'Vertical';
  }
}
