import { Ej2Button } from 'widgets/button/ej2-button';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Button)
export class ButtonDemo {
  showButton = true;
  disabled = false;
  isPrimary = false;
  isToggle = false;
  clickCount = 0;

  content = '<b class="btn-bold">Bold</b> content';
  cssClass = 'btn-custom';
  rtl = false;
  createdCount = 0;
  clickedCount = 0;
  repeatCount = 0;

  onClicked(event: CustomEvent) {
    this.clickedCount++;
    if (event.detail.isRepeat) {
      this.repeatCount++;
    }
  }

  onClick() {
    this.clickCount++;
  }

  toggleLifecycle() {
    this.showButton = !this.showButton;
  }
}
