import { Ej2Rating } from 'widgets/rating/ej2-rating';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Rating)
export class RatingDemo {
  value = 2;
  changeCount = 0;
  previous: number = null;
  interacted: boolean = null;
  hover: number = null;
  beforeCount = 0;
  createdCount = 0;

  halfValue = 2.5;
  itemsValue = 3;
  labelValue = 3;
  tplValue = 2;
  roValue = 4;
  disValue = 2;
  visValue = 1;
  precision = 'Half';

  itemsCount = 5;
  min = 0;
  single = false;

  labelPosition = 'Right';
  labelTpl = '<span class="rt-label-tpl">Rated ${value}</span>';
  tooltipTpl = '<span class="rt-tooltip-tpl">Stars ${value}</span>';

  emptyTpl = '<span class="rt-empty-tpl">o</span>';
  fullTpl = '<span class="rt-full-tpl">x</span>';

  readOnly = true;
  disabled = true;
  visible = true;
  cssClass = 'rt-custom';

  onValueChanged(event: CustomEvent) {
    this.changeCount++;
    this.previous = event.detail.previousValue;
    this.interacted = event.detail.isInteracted;
  }

  onHover(event: CustomEvent) {
    this.hover = event.detail.value;
  }

  changeItems() {
    this.itemsCount = 8;
    this.min = 1;
    this.single = true;
  }

  toggleState() {
    this.readOnly = !this.readOnly;
    this.disabled = !this.disabled;
    this.visible = !this.visible;
    this.cssClass = 'rt-custom-two';
  }
}
