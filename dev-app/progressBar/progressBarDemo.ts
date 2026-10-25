export class ProgressBarDemo {
  noAnimation = { enable: false };
  shortAnimation = { enable: true, duration: 300, delay: 0 };
  labelStyle = { size: '14px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Arial', textAlignment: 'Center' };
  margin = { top: 5, bottom: 5, left: 5, right: 5 };
  segmentColors = ['#1b5e20', '#388e3c', '#66bb6a', '#a5d6a7', '#c8e6c9'];
  annotations = [{ content: '<div id="pb-annotation-content" class="pb-annotation">65%</div>', annotationAngle: 0, annotationRadius: '0%' }];
  rangeColors = [
    { color: '#d32f2f', start: 0, end: 50 },
    { color: '#fbc02d', start: 50, end: 80 },
    { color: '#388e3c', start: 80, end: 100 }
  ];
  tooltip = { enable: true, showTooltipOnHover: true, format: 'Progress ${value}' };
  tooltipText = '';

  dynType = 'Linear';
  dynValue = 30;
  dynTrack = '#cccccc';
  dynProgress = '#1976d2';

  eventValue = 0;
  lastValue: number = null;
  lastTarget = '';
  counts: { [name: string]: number } = {
    load: 0, loaded: 0, textRender: 0, valueChanged: 0, progressCompleted: 0, animationComplete: 0,
    mouseClick: 0, mouseMove: 0, mouseUp: 0, mouseDown: 0, mouseLeave: 0, tooltipRender: 0
  };

  log(name: string, event: CustomEvent) {
    this.counts[name]++;
    const args = event.detail || {};
    if (name === 'tooltipRender') {
      this.tooltipText = args.text;
    }
    if (typeof args.value === 'number' && (name === 'valueChanged' || name === 'progressCompleted' || name === 'animationComplete')) {
      this.lastValue = args.value;
    }
    if (name.indexOf('mouse') === 0) {
      this.lastTarget = args.target;
    }
  }

  onTextRender(event: CustomEvent) {
    this.counts.textRender++;
    // the textRender args can rewrite the label
    event.detail.text = event.detail.text === '100%' ? 'Done' : event.detail.text;
  }

  change() {
    this.dynType = 'Circular';
    this.dynValue = 80;
    this.dynTrack = '#ffcdd2';
    this.dynProgress = '#c62828';
  }
}
