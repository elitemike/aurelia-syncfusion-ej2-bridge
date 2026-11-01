import { Ej2QRCodeGenerator } from 'widgets/qrCodeGenerator/ej2-qrCodeGenerator';
import { viewResources } from 'aurelia-framework';
// 1x1 green pixel PNG, keeps the demo free of external requests
const logoSource = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==';

@viewResources(Ej2QRCodeGenerator)
export class QRCodeGeneratorDemo {
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  displayText = { text: 'Scan me', visibility: true, position: 'Bottom', alignment: 'Center', size: 14 };
  logo = { imageSource: logoSource, width: 30, height: 30 };

  dynSize = 150;
  dynValue = 'first';
  dynFore = 'black';
  dynBack = 'white';

  invalidValue = '\u20ac\u20ac\u20ac';
  invalidCount = 0;
  invalidMessage = '';

  change() {
    this.dynSize = 220;
    this.dynValue = 'second value';
    this.dynFore = '#ff0000';
    this.dynBack = '#eeeeee';
  }

  onInvalid(event: CustomEvent) {
    this.invalidCount++;
    this.invalidMessage = event.detail.message;
  }
}
