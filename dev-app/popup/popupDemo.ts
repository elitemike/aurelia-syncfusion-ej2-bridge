import { Ej2Popup } from 'widgets/popup/ej2-popup';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Popup)
export class PopupDemo {
  basic: any;
  pos: any;
  col: any;
  anim: any;
  container: any;
  scroll: any;

  content = 'Hello from the popup';
  opened = 0;
  closed = 0;
  position: any = { X: 'right', Y: 'bottom' };
  offsetX = 0;
  showAnim: any = { name: 'FadeIn', duration: 50 };
  hideAnim: any = { name: 'FadeOut', duration: 50 };
  exited = 0;

  attached() {
    // a popup is visible right after creation, start every demo popup closed
    // the popup widgets are created in the wrappers' attached callbacks, which run after this one
    setTimeout(() => [this.basic, this.pos, this.col, this.anim, this.container, this.scroll].forEach(p => p.widget.hide()));
  }
}
