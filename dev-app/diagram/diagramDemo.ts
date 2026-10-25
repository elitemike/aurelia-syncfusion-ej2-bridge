import { PLATFORM } from 'aurelia-pal';

export class DiagramDemo {
  parts = [
    PLATFORM.moduleName('diagram/diagramBasicDemo'),
    PLATFORM.moduleName('diagram/diagramDynamicDemo'),
    PLATFORM.moduleName('diagram/diagramFunctionsDemo'),
    PLATFORM.moduleName('diagram/diagramTemplatesDemo'),
    PLATFORM.moduleName('diagram/diagramEventsDemo')
  ];
}
