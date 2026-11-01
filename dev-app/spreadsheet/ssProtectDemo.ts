import { logEvent } from '../queryBuilder/qbLog';
import { Ej2Spreadsheet } from 'widgets/spreadsheet/ej2-spreadsheet';
import { viewResources } from 'aurelia-framework';

/** Workbook protection: isProtected with a password (hash, salt and spin count). */
@viewResources(Ej2Spreadsheet)
export class SsProtectDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = [{
    name: 'Protected',
    isProtected: true,
    protectSettings: { selectCells: true, formatCells: false },
    ranges: [{ dataSource: [{ Item: 'Locked', Value: 1 }, { Item: 'Locked too', Value: 2 }] }]
  }];
}
