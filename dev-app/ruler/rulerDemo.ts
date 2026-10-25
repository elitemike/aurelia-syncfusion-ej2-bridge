export class RulerDemo {
  orientation = 'Horizontal';
  length = 400;
  interval = 5;
  segmentWidth = 100;
  thickness = 25;
  tickAlignment = 'RightOrBottom';
  markerColor = 'red';
  arrangeCount = 0;

  // arrangeTick lets the app shorten the minor ticks
  arrange = (args: any) => {
    this.arrangeCount++;
    if (args.tickLength < this.thickness) { args.tickLength = 6; }
  }
}
