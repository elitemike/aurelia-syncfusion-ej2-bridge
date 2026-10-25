import { PLATFORM } from 'aurelia-pal';

export class BulletChartDemo {
  parts = [
    PLATFORM.moduleName('bulletChart/bulletChartMainDemo'),
    PLATFORM.moduleName('bulletChart/bulletChartSamplesDemo'),
    PLATFORM.moduleName('bulletChart/bulletChartLookDemo'),
    PLATFORM.moduleName('bulletChart/bulletChartEventsDemo')
  ];
}
