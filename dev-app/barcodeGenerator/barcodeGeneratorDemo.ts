export class BarcodeGeneratorDemo {
  samples = [
    { type: 'Code39', value: 'CODE39' },
    { type: 'Code128', value: 'Code128' },
    { type: 'Code128A', value: 'CODE128A' },
    { type: 'Code128B', value: 'Code128B' },
    { type: 'Code128C', value: '12345678' },
    { type: 'Codabar', value: '123456' },
    { type: 'Ean8', value: '12345687' },
    { type: 'Ean13', value: '123456789012' },
    { type: 'UpcA', value: '123456789012' },
    { type: 'UpcE', value: '123456' },
    { type: 'Code11', value: '12345' },
    { type: 'Code93', value: 'CODE93' },
    { type: 'Code32', value: '12345678' }
  ];
  margin = { left: 10, right: 10, top: 5, bottom: 5 };
  displayText = { text: 'Shown below', visibility: true, position: 'Bottom', alignment: 'Center', size: 14 };

  dynWidth = 200;
  dynHeight = 80;
  dynType = 'Code39';
  dynValue = 'FIRST';
  dynFore = 'black';
  dynBack = 'white';

  invalidValue = 'not-a-number';
  invalidCount = 0;
  invalidMessage = '';

  change() {
    this.dynWidth = 320;
    this.dynHeight = 120;
    this.dynType = 'Code128';
    this.dynValue = 'Second';
    this.dynFore = '#0000ff';
    this.dynBack = '#eeeeee';
  }

  onInvalid(event: CustomEvent) {
    this.invalidCount++;
    this.invalidMessage = event.detail.message;
  }
}
