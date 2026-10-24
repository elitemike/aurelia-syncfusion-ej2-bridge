import { ProgressBar, ProgressBarModel } from '@syncfusion/ej2-progressbar';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("progressBar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-progress-bar')
export class Ej2ProgressBar extends SyncfusionWrapper<ProgressBar, ProgressBarModel> {
  protected syncfusionWidgetType = ProgressBar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
