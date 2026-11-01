import { createDataSourceSettings } from './pivotData';
import { Ej2PivotView } from 'widgets/pivotView/ej2-pivotView';
import { viewResources } from 'aurelia-framework';

/** Virtual scrolling and paging over a generated data set (Syncfusion "Virtual scrolling" and "Paging" samples). */
function generate() {
  const data: any[] = [];
  for (let r = 1; r <= 12; r++) {
    for (let p = 1; p <= 60; p++) {
      for (let y = 0; y < 6; y++) {
        data.push({ Region: `Region ${String(r).padStart(2, '0')}`, Product: `Product ${String(p).padStart(2, '0')}`, Year: `FY ${2018 + y}`,
          Sold: 1 + ((r * 31 + p * 17 + y * 7) % 90), Amount: 100 + ((r * 13 + p * 29 + y * 5) % 900) });
      }
    }
  }
  return data;
}

const big = generate();
const settings = () => ({
  dataSource: big, expandAll: true, enableSorting: true,
  rows: [{ name: 'Region' }, { name: 'Product' }], columns: [{ name: 'Year' }],
  values: [{ name: 'Sold' }, { name: 'Amount' }], filters: []
});

@viewResources(Ej2PivotView)
export class PvLargeDataDemo {
  virtualDsr: any = settings();
  pagingDsr: any = settings();
  virtualScrollSettings = { allowSinglePage: false };
  pageSettings = { columnPageSize: 4, rowPageSize: 20, currentColumnPage: 1, currentRowPage: 1 };
  pagerSettings = { position: 'Bottom', showColumnPager: true, showRowPager: true, showPageInfo: true };
  gridSettings = { columnWidth: 120 };
}
