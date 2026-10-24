import { ProgressBar, ProgressBarModel, ProgressAnnotation, ProgressTooltip } from '@syncfusion/ej2-progressbar';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { ensureHostId, refreshOnPropertyChange } from '../visualizationHelpers';

@generateBindables("progressBar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-progress-bar')
export class Ej2ProgressBar extends SyncfusionWrapper<ProgressBar, ProgressBarModel> {
  protected syncfusionWidgetType = ProgressBar;

  protected onBeforeWidgetInstantiation() {
    // ProgressBar.Inject registers modules globally. The widget only activates a module when its option asks for it
    // (annotations with content, tooltip.enable), but those options can be switched on after creation, so always
    // bring both modules.
    ProgressBar.Inject(ProgressAnnotation, ProgressTooltip);
  }

  protected appendWidget() {
    ensureHostId(this.widgetElement, 'progressBar');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the progress bar has no `created` event, and only handles these properties after render
    refreshOnPropertyChange(this, this.widget, ['annotations', 'value', 'animation', 'type']);
  }

  protected onWidgetCreated() {
  }
}
