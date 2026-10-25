import { transmission1, transmission2 } from './smithchartLog';

export class SmithchartSamplesDemo {
  // Syncfusion "Admittance", "Data labels and markers", "Legend" samples
  admittanceSeries: any[] = [{ points: transmission1, name: 'Admittance line', enableAnimation: false, width: 2, tooltip: { visible: true } }];
  labelSeries: any[] = [{
    points: transmission2.slice(0, 6), name: 'Labelled', enableAnimation: false, width: 2,
    marker: { visible: true, shape: 'Rectangle', width: 9, height: 9, dataLabel: { visible: true, template: null } },
    tooltip: { visible: true }
  }];
  legendSeries: any[] = [
    { points: transmission1, name: 'Line A', enableAnimation: false },
    { points: transmission2, name: 'Line B', enableAnimation: false }
  ];
  legend = { visible: true, position: 'Right', shape: 'Rectangle', toggleVisibility: true };
}
