import { Sidebar } from '@syncfusion/ej2-navigations';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';

export class SidebarDemo {
  private sidebar: IEJ2WidgetBridge<Sidebar> = null;

  toggleSidebar() {
    this.sidebar.widget.toggle();
  }
}
