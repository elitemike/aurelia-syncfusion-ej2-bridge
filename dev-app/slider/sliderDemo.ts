export class SliderDemo {
  value = 40;
  range = [30, 70];
  changedCount = 0;

  onChanged() {
    this.changedCount++;
  }

  setValue() {
    this.value = 80;
  }
}
