import { PLATFORM } from 'aurelia-pal';

export class CircularChart3DDemo {
  parts = [
    PLATFORM.moduleName('circularChart3D/circularChart3DMainDemo'),
    PLATFORM.moduleName('circularChart3D/circularChart3DSamplesDemo'),
    PLATFORM.moduleName('circularChart3D/circularChart3DInteractionDemo'),
    PLATFORM.moduleName('circularChart3D/circularChart3DEventsDemo')
  ];
}
