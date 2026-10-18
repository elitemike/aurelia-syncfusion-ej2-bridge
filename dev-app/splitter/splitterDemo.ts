import { Splitter, SplitterModel } from '@syncfusion/ej2-layouts';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';

export class SplitterDemo {
  splitter: IEJ2WidgetBridge<Splitter> = null;
  collapsed = 0;
  expanded = 0;
  resizeStops = 0;

  horizontalModel: SplitterModel = {
    height: '200px',
    width: '100%',
    separatorSize: 6,
    paneSettings: [{ size: '40%', collapsible: true, min: '100px' }, { collapsible: true }]
  };

  verticalModel: SplitterModel = {
    height: '240px',
    width: '100%',
    orientation: 'Vertical',
    separatorSize: 6,
    paneSettings: [{ size: '50%' }, {}]
  };

  onCollapsed() {
    this.collapsed++;
  }

  onExpanded() {
    this.expanded++;
  }

  onResizeStop() {
    this.resizeStops++;
  }

  collapseLeft() {
    this.splitter.widget.collapse(0);
  }

  expandLeft() {
    this.splitter.widget.expand(0);
  }
}
