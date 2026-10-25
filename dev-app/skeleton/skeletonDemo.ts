export class SkeletonDemo {
  width = '100px';
  height = '20px';
  shape = 'Text';
  effect = 'Wave';
  visible = true;
  label = 'Loading...';
  cssClass = 'sk-one';

  resize() {
    this.width = '300px';
    this.height = '40px';
  }
}
