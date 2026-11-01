import { Overview, OverviewModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { moveIdToHost } from '../diagramHelpers';

@generateBindables("overview")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-overview')
export class Ej2Overview extends SyncfusionWrapper<Overview, OverviewModel> {
  protected syncfusionWidgetType = Overview;

  protected appendWidget() {
    moveIdToHost(this.element, this.widgetElement, 'overview');
    // The overview reads the diagram it mirrors (sourceID) while it renders. When the diagram is declared later in
    // the page it is not rendered yet, wait for it.
    const source = (<any>this.widget).sourceID;
    const ready = () => {
      const host: any = source && document.getElementById(source);
      return !source || !!(host && host.ej2_instances && host.ej2_instances.length);
    };
    let attempts = 0;
    const append = () => {
      if (!this.widget || !this.widgetElement) { return; }
      if (!ready() && attempts++ < 100) {
        setTimeout(append, 20);
        return;
      }
      super.appendWidget();
    };
    append();
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
