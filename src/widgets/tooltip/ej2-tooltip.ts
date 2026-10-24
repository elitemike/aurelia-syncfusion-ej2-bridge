import { Tooltip, TooltipModel } from '@syncfusion/ej2-popups';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("tooltip")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tooltip')
export class Ej2Tooltip extends SyncfusionWrapper<Tooltip, TooltipModel> {
  protected syncfusionWidgetType = Tooltip;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
