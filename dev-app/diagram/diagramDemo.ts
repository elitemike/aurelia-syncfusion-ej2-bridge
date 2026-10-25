import { PLATFORM } from 'aurelia-pal';

export class DiagramDemo {
  parts = [
    PLATFORM.moduleName('diagram/diagramBasicDemo'),
    PLATFORM.moduleName('diagram/diagramDynamicDemo')
  ];
}
