const blueBackground = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160"><rect width="400" height="160" fill="rgb(0,0,255)"/></svg>');

export class SignatureDemo {
  basic: any;
  saver: any;
  changeCount = 0;
  action = '';
  createdCount = 0;

  strokeColor = '#ff0000';
  minWidth = 1;
  maxWidth = 4;
  velocity = 0.7;
  backgroundColor = '#ffffe0';

  backgroundImage = blueBackground;
  saveWithBackground = true;

  disabled = true;
  readOnly = true;
  disabledChanges = 0;
  readOnlyChanges = 0;

  beforeSave = '';
  cancelSave = false;

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.action = event.detail.actionName;
  }

  changeLook() {
    this.strokeColor = '#0000ff';
    this.minWidth = 5;
    this.maxWidth = 10;
    this.velocity = 0.2;
    this.backgroundColor = '#e0ffe0';
  }

  toggleState() {
    this.disabled = false;
    this.readOnly = false;
  }

  onBeforeSave(event: CustomEvent) {
    this.beforeSave = `${event.detail.type}:${event.detail.fileName}`;
    if (this.cancelSave) {
      event.detail.cancel = true;
    }
  }
}
