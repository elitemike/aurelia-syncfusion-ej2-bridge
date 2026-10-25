import { DataManager } from '@syncfusion/ej2-data';
import { logEvent } from './diagramLog';

const link = (id: string, from: string, to: string) => ({ id, sourceID: from, targetID: to });

export class DiagramLayoutDemo {
  log = (name: string, e: Event) => logEvent('lay:' + name, e);

  // organisational chart bound to a data source
  orgData = [
    { Id: 'ceo', Name: 'CEO' },
    { Id: 'cto', Name: 'CTO', Manager: 'ceo' },
    { Id: 'cfo', Name: 'CFO', Manager: 'ceo' },
    { Id: 'dev', Name: 'Dev lead', Manager: 'cto' },
    { Id: 'ops', Name: 'Ops lead', Manager: 'cto' },
    { Id: 'acc', Name: 'Accounting', Manager: 'cfo' }
  ];
  orgSource = { id: 'Id', parentId: 'Manager', dataManager: new DataManager(this.orgData) };
  orgLayout: any = { type: 'OrganizationalChart', margin: { top: 20, left: 20 }, horizontalSpacing: 30, verticalSpacing: 40, enableAnimation: true };
  orgLayoutSideways = { type: 'OrganizationalChart', orientation: 'LeftToRight', margin: { top: 20, left: 20 }, horizontalSpacing: 30, verticalSpacing: 40, enableAnimation: true };
  orgConnectorDefaults = { type: 'Orthogonal', style: { strokeColor: '#6ba5d7', strokeWidth: 2 } };
  orgNodeDefaults = (obj: any) => {
    obj.height = 36;
    obj.width = 100;
    obj.style = { fill: '#6ba5d7', strokeColor: 'white' };
    obj.annotations = [{ content: obj.data && obj.data.Name, style: { color: 'white' } }];
    obj.expandIcon = { shape: 'ArrowDown', height: 14, width: 14 };
    obj.collapseIcon = { shape: 'ArrowUp', height: 14, width: 14 };
    return obj;
  }

  common = { width: 100, height: 36, style: { fill: '#8fc1e3', strokeColor: 'white' } };
  plainConnectors = { type: 'Straight', style: { strokeColor: '#6ba5d7', strokeWidth: 2 } };

  mindNodes: any[] = [
    { id: 'root', offsetX: 300, offsetY: 150, annotations: [{ content: 'Idea' }], addInfo: { orientation: 'Root' } },
    { id: 'm1', offsetX: 0, offsetY: 0, annotations: [{ content: 'Right 1' }], addInfo: { orientation: 'Right' } },
    { id: 'm2', offsetX: 0, offsetY: 0, annotations: [{ content: 'Right 2' }], addInfo: { orientation: 'Right' } },
    { id: 'm3', offsetX: 0, offsetY: 0, annotations: [{ content: 'Left 1' }], addInfo: { orientation: 'Left' } },
    { id: 'm4', offsetX: 0, offsetY: 0, annotations: [{ content: 'Left 2' }], addInfo: { orientation: 'Left' } }
  ];
  mindConnectors = [link('mc1', 'root', 'm1'), link('mc2', 'root', 'm2'), link('mc3', 'root', 'm3'), link('mc4', 'root', 'm4')];
  mindLayout = {
    type: 'MindMap', horizontalSpacing: 50, verticalSpacing: 20, root: 'root',
    getBranch: (node: any) => (node.addInfo && node.addInfo.orientation ? node.addInfo.orientation.toString() : 'Left')
  };

  radialNodes: any[] = ['r', 'a', 'b', 'c', 'd'].map((id) => ({ id, offsetX: 250, offsetY: 150, annotations: [{ content: id }] }));
  radialConnectors = [link('rc1', 'r', 'a'), link('rc2', 'r', 'b'), link('rc3', 'a', 'c'), link('rc4', 'a', 'd')];
  radialLayout = { type: 'RadialTree', root: 'r', horizontalSpacing: 40, verticalSpacing: 40 };

  symNodes: any[] = ['s1', 's2', 's3', 's4'].map((id) => ({ id, offsetX: 250, offsetY: 150, annotations: [{ content: id }] }));
  symConnectors = [link('sc1', 's1', 's2'), link('sc2', 's1', 's3'), link('sc3', 's3', 's4')];
  symLayout = { type: 'SymmetricalLayout', springLength: 90, springFactor: 0.8, maxIteration: 500 };

  complexNodes: any[] = ['x1', 'x2', 'x3', 'x4', 'x5'].map((id) => ({ id, offsetX: 250, offsetY: 150, annotations: [{ content: id }] }));
  complexConnectors = [link('xc1', 'x1', 'x2'), link('xc2', 'x1', 'x3'), link('xc3', 'x2', 'x4'), link('xc4', 'x3', 'x4'), link('xc5', 'x4', 'x5')];
  complexLayout = { type: 'ComplexHierarchicalTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom', margin: { left: 20, top: 20 } };

  flowNodes: any[] = ['f1', 'f2', 'f3', 'f4'].map((id) => ({ id, offsetX: 250, offsetY: 150, annotations: [{ content: id }] }));
  flowConnectors = [link('fc1', 'f1', 'f2'), link('fc2', 'f2', 'f3'), link('fc3', 'f2', 'f4')];
  flowLayout = { type: 'Flowchart', verticalSpacing: 40, horizontalSpacing: 40, margin: { left: 20, top: 20 } };

  changeLayout() {
    this.orgLayout = this.orgLayoutSideways;
  }
}
