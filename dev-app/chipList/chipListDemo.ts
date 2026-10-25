export class ChipListDemo {
  chips = ['Small', 'Medium', 'Large'];
  enabled = true;
  created = 0;
  beforeClick = 0;
  clicked = 0;
  lastClicked = '';
  cancelClick = false;

  sizes = ['Small', 'Medium', 'Large', 'Extra large'];
  single: any = 0;
  multiple: any = [1];

  fruits = ['Apple', 'Orange', 'Banana'];
  deleteRequests = 0;
  deleted = 0;
  protectFirst = false;

  colors = ['Red', 'Green', 'Blue'];
  dragStart = 0;
  dragging = 0;
  dragStop = 0;

  onBeforeClick(event: CustomEvent) {
    this.beforeClick++;
    if (this.cancelClick) {
      event.detail.cancel = true;
    }
  }

  onClick(event: CustomEvent) {
    this.clicked++;
    this.lastClicked = event.detail.text;
  }

  addChip() {
    this.chips = [...this.chips, `Chip ${this.chips.length + 1}`];
  }

  setMultiple() {
    this.multiple = [0, 3];
  }

  onDelete(event: CustomEvent) {
    this.deleteRequests++;
    if (this.protectFirst && event.detail.text === 'Apple') {
      event.detail.cancel = true;
    }
  }

  get multipleText() {
    return JSON.stringify(this.multiple);
  }
}
