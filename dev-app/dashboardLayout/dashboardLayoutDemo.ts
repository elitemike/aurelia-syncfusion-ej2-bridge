import { Ej2DashboardLayout } from 'widgets/dashboardLayout/ej2-dashboardLayout';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2DashboardLayout)
export class DashboardLayoutDemo {
  columns = 4;
  showGridLines = true;
  allowDragging = true;
  changes = 0;
  dragStarts = 0;
  drags = 0;
  dragStops = 0;
  resizeStarts = 0;
  resizes = 0;
  resizeStops = 0;
  showLifecycle = true;
  created = 0;
  destroyed = 0;

  resizePanels = [
    { id: 'r1', row: 0, col: 0, sizeX: 2, sizeY: 2, header: '<div>Resizable</div>', content: '<div>R</div>' }
  ];

  handlePanels = [
    { id: 'h1', row: 0, col: 0, sizeX: 2, sizeY: 1, header: '<div class="dh">Handle</div>', content: '<div class="body">Body</div>' }
  ];

  optionPanels = [
    { id: 'o1', row: 0, col: 0, sizeX: 1, sizeY: 1, header: '<div>One</div>', content: '<div>1</div>' },
    { id: 'o2', row: 2, col: 1, sizeX: 1, sizeY: 1, header: '<div>Two</div>', content: '<div>2</div>' }
  ];

  panels = [
    { id: 'p1', row: 0, col: 0, sizeX: 1, sizeY: 1, header: '<div>Panel 1</div>', content: '<div>One</div>' },
    { id: 'p2', row: 0, col: 1, sizeX: 2, sizeY: 1, header: '<div>Panel 2</div>', content: '<div>Two</div>' },
    { id: 'p3', row: 1, col: 0, sizeX: 3, sizeY: 1, header: '<div>Panel 3</div>', content: '<div>Three</div>' }
  ];

  onChange() {
    this.changes++;
  }
}
