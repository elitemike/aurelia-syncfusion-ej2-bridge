export class PDF417GeneratorDemo {
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  displayText = { text: 'Scan me', visibility: true, position: 'Bottom', alignment: 'Center', size: 14 };

  dynWidth = 300;
  dynHeight = 120;
  dynValue = 'first';
  dynFore = 'black';
  dynBack = 'white';

  invalidValue = 'letters only';
  invalidCount = 0;
  invalidMessage = '';

  change() {
    this.dynWidth = 420;
    this.dynHeight = 160;
    this.dynValue = 'second value';
    this.dynFore = '#ff0000';
    this.dynBack = '#eeeeee';
  }

  onInvalid(event: CustomEvent) {
    this.invalidCount++;
    this.invalidMessage = event.detail.message;
  }
}
