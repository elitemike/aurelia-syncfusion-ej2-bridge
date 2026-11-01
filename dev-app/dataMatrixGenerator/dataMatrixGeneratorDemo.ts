import { Ej2DataMatrixGenerator } from 'widgets/dataMatrixGenerator/ej2-dataMatrixGenerator';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DataMatrixGenerator)
export class DataMatrixGeneratorDemo {
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  displayText = { text: 'Scan me', visibility: true, position: 'Bottom', alignment: 'Center', size: 14 };

  dynSize = 150;
  dynValue = 'first';
  dynFore = 'black';
  dynBack = 'white';

  invalidValue = 'letters only';
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
