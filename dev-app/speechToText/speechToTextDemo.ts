export class SpeechToTextDemo {
  basic: any;
  transcript = '';
  state = 'Inactive';
  startCount = 0;
  stopCount = 0;
  startInteracted: boolean = null;
  transcriptEvents = 0;
  interim: boolean = null;
  error = '';
  createdCount = 0;
  cancelStart = false;

  lang = 'en-US';
  interim2 = true;

  buttonSettings: any = { content: 'Speak', stopContent: 'Halt', iconCss: 'e-icons e-listen-icon', stopIconCss: 'e-icons e-listen-stop', iconPosition: 'Left', isPrimary: true };
  tooltipSettings: any = { content: 'Tap to talk', stopContent: 'Tap to stop', position: 'BottomCenter' };
  showTooltip = true;

  disabled = true;
  cssClass = 'stt-custom';
  htmlAttrs = { 'data-foo': 'bar' };

  onStart(event: CustomEvent) {
    this.startCount++;
    this.startInteracted = event.detail.isInteracted;
    if (this.cancelStart) {
      event.detail.cancel = true;
    }
  }

  onStop() {
    this.stopCount++;
  }

  onError(event: CustomEvent) {
    this.error = event.detail.error;
  }

  onTranscript(event: CustomEvent) {
    this.transcriptEvents++;
    this.interim = event.detail.isInterimResult;
  }

  changeLang() {
    this.lang = 'de-DE';
    this.interim2 = false;
  }

  changeButton() {
    this.buttonSettings = { content: 'Talk', stopContent: 'Quiet', iconCss: 'e-icons e-listen-icon', stopIconCss: 'e-icons e-listen-stop', iconPosition: 'Right', isPrimary: false };
    this.tooltipSettings = { content: 'Click to talk', stopContent: 'Click to stop', position: 'TopCenter' };
    this.showTooltip = false;
  }

  changeState() {
    this.disabled = false;
    this.cssClass = 'stt-custom-two';
    this.htmlAttrs = { 'data-foo': 'baz' };
  }
}
