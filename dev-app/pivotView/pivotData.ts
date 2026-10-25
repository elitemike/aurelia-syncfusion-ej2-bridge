/** Local sales data in the shape of the Syncfusion pivot samples (no remote hosts). */
const countries = ['France', 'Germany', 'Canada', 'United States'];
const products = ['Bike', 'Car', 'Van'];
const years = ['FY 2022', 'FY 2023'];
const quarters = ['Q1', 'Q2'];

export const pivotData: any[] = [];
let n = 0;
countries.forEach((Country, ci) => {
  products.forEach((Products, pi) => {
    years.forEach((Year, yi) => {
      quarters.forEach((Quarter, qi) => {
        n++;
        pivotData.push({
          Country, Products, Year, Quarter,
          Sold: 10 + ((n * 7) % 23),
          Amount: 1000 + ci * 500 + pi * 250 + yi * 100 + qi * 50
        });
      });
    });
  });
});

/** Fresh settings object per demo section, the widgets keep a reference to it. */
export function createDataSourceSettings(extra: any = {}) {
  return {
    dataSource: pivotData.map((row) => ({ ...row })),
    expandAll: false,
    enableSorting: true,
    columns: [{ name: 'Year', caption: 'Production Year' }],
    rows: [{ name: 'Country' }, { name: 'Products' }],
    values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
    formatSettings: [{ name: 'Amount', format: 'C0' }],
    filters: [],
    ...extra
  };
}
