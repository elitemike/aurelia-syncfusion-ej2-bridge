import { Ej2Fab } from 'widgets/fab/ej2-fab';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Fab)
export class FabDemo {
  positions = ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'];
  position = 'BottomRight';
  iconPosition = 'Left';
  isPrimary = true;
  visible = true;
  disabled = false;
  created = 0;
  clicked = 0;

  content = 'Create';
  repeatCount = 0;
}
