import { logEvent } from '../queryBuilder/qbLog';

/** Workbook protection: isProtected with a password (hash, salt and spin count). */
export class SsProtectDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  sheets = [{
    name: 'Protected',
    isProtected: true,
    protectSettings: { selectCells: true, formatCells: false },
    ranges: [{ dataSource: [{ Item: 'Locked', Value: 1 }, { Item: 'Locked too', Value: 2 }] }]
  }];
}
