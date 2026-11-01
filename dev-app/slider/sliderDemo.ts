import { Ej2Slider } from 'widgets/slider/ej2-slider';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Slider)
export class SliderDemo {
  value = 40;
  range = [30, 70];
  changedCount = 0;

  createdCount = 0;
  renderingTicksCount = 0;
  renderedTicksCount = 0;
  tooltipText: string = null;
  changeValue: number = null;
  changeCount = 0;

  moreValue = 50;
  enabled = true;
  limits = { enabled: true, minStart: 20, minEnd: 80 };
  colorRange = [{ start: 0, end: 30, color: '#ff0000' }, { start: 30, end: 100, color: '#00aa00' }];

  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  sizeIndex = 2;

  onTooltipChange(event: CustomEvent) {
    this.tooltipText = event.detail.text;
  }

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
  }

  onChanged() {
    this.changedCount++;
  }

  setValue() {
    this.value = 80;
  }
}
