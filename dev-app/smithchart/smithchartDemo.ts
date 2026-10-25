import { PLATFORM } from 'aurelia-pal';

export class SmithchartDemo {
  parts = [
    PLATFORM.moduleName('smithchart/smithchartMainDemo'),
    PLATFORM.moduleName('smithchart/smithchartSamplesDemo'),
    PLATFORM.moduleName('smithchart/smithchartEventsDemo')
  ];
}
