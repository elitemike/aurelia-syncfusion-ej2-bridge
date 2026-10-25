import { Query } from '@syncfusion/ej2-data';

export class BulletChartSamplesDemo {
  // Syncfusion "Multiple bullet charts / Vertical orientation / Target types / Data binding" samples
  categories = [
    { category: 'Revenue', value: 270, target: 250 },
    { category: 'Expenses', value: 160, target: 200 },
    { category: 'Profit', value: 90, target: 60 },
    { category: 'Orders', value: 280, target: 290 }
  ];
  query = new Query().take(3);
  ranges = [
    { end: 100, color: '#f7c6c6' },
    { end: 200, color: '#f7e3a1' },
    { end: 300, color: '#b7e3b0' }
  ];
  verticalRanges = [{ end: 20, color: '#cfd8dc' }, { end: 60, color: '#b0bec5' }, { end: 100, color: '#90a4ae' }];
  verticalData = [{ value: 72, target: 65 }];
  targetTypes = ['Circle', 'Cross'];
  noAnimation = { enable: false };
  dotTargets = [{ value: 70, target: 60 }, { value: 40, target: 55 }];
  targetTypeSets = [['Rect'], ['Circle'], ['Cross']];
  labelStyle = { size: '12px' };
  groupData = [{ value: 3200, target: 4100 }];
  groupRanges = [{ end: 2000, color: '#cfd8dc' }, { end: 5000, color: '#90a4ae' }];
  categoryLabelStyle = { size: '14px', color: '#1b4f72', fontWeight: '700' };
  dotData = [{ category: 'Rect', value: 70, target: 60 }, { category: 'Circle', value: 70, target: 60 }, { category: 'Cross', value: 70, target: 60 }];
}
