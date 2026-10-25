import { browsers } from './circularChart3DLog';

export class CircularChart3DSamplesDemo {
  // Syncfusion "3D Doughnut" and "Exploding" samples
  doughnut: any[] = [{ dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', innerRadius: '40%', radius: '80%' }];
  explode: any[] = [{
    dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', explode: true, explodeIndex: 1, explodeOffset: '15%',
    radius: '75%', dataLabel: { visible: true, name: 'text', position: 'Inside' }
  }];
  explodeAll: any[] = [{
    dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', explodeAll: true, explodeOffset: '8%', radius: '70%'
  }];
}
