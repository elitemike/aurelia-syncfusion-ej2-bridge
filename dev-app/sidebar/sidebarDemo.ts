import { Sidebar } from '@syncfusion/ej2-navigations';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { Ej2Sidebar } from 'widgets/sidebar/ej2-sidebar';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Sidebar)
export class SidebarDemo {
  sidebar: IEJ2WidgetBridge<Sidebar> = null;
  isOpen = false;
  opened = 0;
  closed = 0;
  type = 'Over';
  changed = 0;
  position = 'Right';
  optOpen = false;
  mediaOpen = false;
  showLifecycle = true;
  created = 0;
  destroyed = 0;

  onOpen() {
    this.opened++;
  }

  onClose() {
    this.closed++;
  }

  toggleApi() {
    this.sidebar.widget.toggle();
  }
}
