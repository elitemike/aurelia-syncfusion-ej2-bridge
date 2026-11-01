import { gallery } from './chartSeriesData';
import { Ej2Chart } from 'widgets/chart/ej2-chart';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Chart)
export class ChartSeriesDemo {
  gallery = gallery;
}
