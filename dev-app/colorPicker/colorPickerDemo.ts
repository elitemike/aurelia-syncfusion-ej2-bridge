export class ColorPickerDemo {
  value = '#008000ff';
  showButtons = true;
  selected = '';
  selectCount = 0;
  changeCount = 0;
  changeHex = '';
  changePrev = '';
  beforeOpenCount = 0;
  openCount = 0;
  beforeCloseCount = 0;
  createdCount = 0;
  blockClose = false;

  paletteValue = '#ff0000ff';
  presets = {
    custom: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#000000', '#ffffff']
  };
  columns = 4;
  noColor = true;
  tileCount = 0;
  paletteChanges = 0;

  opacity = true;
  mode = 'Picker';
  beforeSwitch = '';
  onSwitchMode = '';

  disabled = true;
  cssClass = 'cp-custom';

  onSelect(event: CustomEvent) {
    this.selectCount++;
    this.selected = event.detail.currentValue.hex;
  }

  onChange(event: CustomEvent) {
    this.changeCount++;
    this.changeHex = event.detail.currentValue.hex;
    this.changePrev = event.detail.previousValue.hex;
  }

  onBeforeClose(event: CustomEvent) {
    this.beforeCloseCount++;
    if (this.blockClose) {
      event.detail.cancel = true;
    }
  }

  onTile() {
    this.tileCount++;
  }

  onBeforeSwitch(event: CustomEvent) {
    this.beforeSwitch = event.detail.mode;
  }

  onSwitch(event: CustomEvent) {
    this.onSwitchMode = event.detail.mode;
  }

  changeLook() {
    this.disabled = false;
    this.cssClass = 'cp-custom-two';
  }
}
