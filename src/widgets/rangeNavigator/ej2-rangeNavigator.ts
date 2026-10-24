import { RangeNavigator, RangeNavigatorModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("rangeNavigator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-range-navigator')
export class Ej2RangeNavigator extends SyncfusionWrapper<RangeNavigator, RangeNavigatorModel> {
  protected syncfusionWidgetType = RangeNavigator;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
