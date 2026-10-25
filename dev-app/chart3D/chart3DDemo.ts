import { PLATFORM } from 'aurelia-pal';

export class Chart3DDemo {
  parts = [
    PLATFORM.moduleName('chart3D/chart3DMainDemo'),
    PLATFORM.moduleName('chart3D/chart3DSeriesDemo'),
    PLATFORM.moduleName('chart3D/chart3DInteractionDemo'),
    PLATFORM.moduleName('chart3D/chart3DAxesDemo'),
    PLATFORM.moduleName('chart3D/chart3DEventsDemo')
  ];
}
