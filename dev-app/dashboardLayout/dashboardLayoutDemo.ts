export class DashboardLayoutDemo {
  columns = 4;
  showGridLines = true;
  allowDragging = true;
  changes = 0;

  panels = [
    { id: 'p1', row: 0, col: 0, sizeX: 1, sizeY: 1, header: '<div>Panel 1</div>', content: '<div>One</div>' },
    { id: 'p2', row: 0, col: 1, sizeX: 2, sizeY: 1, header: '<div>Panel 2</div>', content: '<div>Two</div>' },
    { id: 'p3', row: 1, col: 0, sizeX: 3, sizeY: 1, header: '<div>Panel 3</div>', content: '<div>Three</div>' }
  ];

  onChange() {
    this.changes++;
  }
}
