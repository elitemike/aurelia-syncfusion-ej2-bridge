import { Grid, GridModel } from '@syncfusion/ej2-grids';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { generateBindables } from 'utilities/decorator';

@generateBindables("grid")
export class Ej2Grid extends SyncfusionWrapper<Grid, GridModel> {
  protected syncfusionWidgetType = Grid;

}
