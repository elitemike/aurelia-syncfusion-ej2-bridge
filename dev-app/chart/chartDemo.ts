import { PLATFORM } from 'aurelia-pal';

export class ChartDemo {
  parts = [
    PLATFORM.moduleName('chart/chartLookDemo'),
    PLATFORM.moduleName('chart/chartSeriesDemo'),
    PLATFORM.moduleName('chart/chartInteractionDemo'),
    PLATFORM.moduleName('chart/chartAxesDemo'),
    PLATFORM.moduleName('chart/chartFeaturesDemo'),
    PLATFORM.moduleName('chart/chartEventsDemo')
  ];
}
