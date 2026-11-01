import { Splitter, SplitterModel } from '@syncfusion/ej2-layouts';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { Ej2Splitter } from 'widgets/splitter/ej2-splitter';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Splitter)
export class SplitterDemo {
  splitter: IEJ2WidgetBridge<Splitter> = null;
  collapsed = 0;
  expanded = 0;
  resizeStops = 0;
  resizeStarts = 0;
  resizings = 0;
  beforeCollapse = 0;
  beforeExpand = 0;
  created = 0;
  sanitized = 0;
  reverse = false;
  enabled = true;
  propPanes = [
    { size: '40%', content: '<b class="pane-a">Pane A</b>' },
    { content: '<b class="pane-b">Pane B</b>' }
  ];

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
