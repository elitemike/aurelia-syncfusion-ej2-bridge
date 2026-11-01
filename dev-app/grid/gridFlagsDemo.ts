import { data } from './gridDemo';
import { Ej2Grid } from 'widgets/grid/ej2-grid';
import { viewResources } from 'aurelia-framework';

/**
 * Lives on its own page on purpose: Grid.Inject registers modules globally, so on the main grid page
 * another grid would already have injected them. Here the only grid must bring its own modules.
 */
@viewResources(Ej2Grid)
export class GridFlagsDemo {
  data = data;
  columns = [
    { field: 'OrderID', headerText: 'Order ID', width: 110, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
    { field: 'Freight', headerText: 'Freight', width: 110, format: 'C2', textAlign: 'Right' }
  ];
}
