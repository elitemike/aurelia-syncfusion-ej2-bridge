import { PLATFORM } from 'aurelia-pal';
import { logEvent } from '../queryBuilder/qbLog';
import { Ej2Spreadsheet } from 'widgets/spreadsheet/ej2-spreadsheet';
import { viewResources } from 'aurelia-framework';

export function createSheets() {
  return [
    {
      name: 'Sales',
      ranges: [{
        dataSource: [
          { Item: 'Casual Shoes', Region: 'North', Sold: 10, Price: 20, Date: '2024-01-05' },
          { Item: 'Sports Shoes', Region: 'South', Sold: 20, Price: 30, Date: '2024-01-06' },
          { Item: 'Formal Shoes', Region: 'East', Sold: 15, Price: 25, Date: '2024-01-07' },
          { Item: 'Sandals', Region: 'West', Sold: 8, Price: 12, Date: '2024-01-08' },
          { Item: 'Boots', Region: 'North', Sold: 5, Price: 45, Date: '2024-01-09' }
        ]
      }],
      columns: [{ width: 120 }, { width: 80 }, { width: 70 }, { width: 70 }, { width: 100 }]
    },
    { name: 'Notes', ranges: [{ dataSource: [{ Note: 'Second sheet' }] }] }
  ];
}

@viewResources(Ej2Spreadsheet)
export class SpreadsheetDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  parts = [
    PLATFORM.moduleName('spreadsheet/ssFileDemo'),
    PLATFORM.moduleName('spreadsheet/ssProtectDemo'),
    PLATFORM.moduleName('spreadsheet/ssAdvancedDemo')
  ];

  destroyedCount = 0;
  onDestroyed() { this.destroyedCount++; }
  showMain = true;

  sheets = createSheets();
  activeSheetIndex = 0;
  // filter and sort collections that came from an imported file, none here
  filterCollection: any[] = [];
  sortCollection: any[] = [];
  selectionSettings = { mode: 'Multiple' };
  scrollSettings = { isFinite: true, enableVirtualization: true };
  autoFillSettings = { fillType: 'FillSeries', showFillOptions: true };
  cellStyle = { fontFamily: 'Arial', fontSize: '11pt' };
  definedNames = [{ name: 'SoldRange', refersTo: 'Sales!C2:C6' }];
  // a plain object with the property names the specs read back
  calculationMode = 'Automatic';
  setSheet(i: number) { this.activeSheetIndex = i; }
}
