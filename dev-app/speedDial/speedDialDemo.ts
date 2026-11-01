import { Ej2SpeedDial } from 'widgets/speedDial/ej2-speedDial';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2SpeedDial)
export class SpeedDialDemo {
  items = [
    { id: 'sd-item-cut', text: 'Cut', iconCss: 'e-icons e-cut' },
    { id: 'sd-item-copy', text: 'Copy', iconCss: 'e-icons e-copy' },
    { id: 'sd-item-paste', text: 'Paste', iconCss: 'e-icons e-paste' }
  ];
  direction = 'Up';
  iconPosition = 'Left';
  isPrimary = true;
  disabled = false;
  visible = true;
  created = 0;
  beforeOpen = 0;
  opened = 0;
  beforeClose = 0;
  closed = 0;
  itemRenders = 0;
  clickedItem = '';

  radial = { startAngle: 180, endAngle: 270, offset: '80px' };
  animation = { effect: 'Fade', duration: 100, delay: 0 };

  itemTemplate = '<div class="sd-tpl-item" data-text="${text}"><b>${text}</b></div>';
  popupTemplate = '<div class="sd-tpl-popup"><span>Custom popup</span></div>';

  onClicked(event: CustomEvent) {
    this.clickedItem = event.detail.item.text;
  }
}
