import { LinearGauge, LinearGaugeModel, Annotations, GaugeTooltip, Print, ImageExport, PdfExport, Gradient } from '@syncfusion/ej2-lineargauge';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { ensureHostId, refreshOnPropertyChange } from '../visualizationHelpers';

@generateBindables("linearGauge")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-linear-gauge')
export class Ej2LinearGauge extends SyncfusionWrapper<LinearGauge, LinearGaugeModel> {
  protected syncfusionWidgetType = LinearGauge;

  protected onBeforeWidgetInstantiation() {
    // LinearGauge.Inject registers modules globally. The gauge only activates a module when its option asks for it
    // (annotation content, tooltip.enable, allowPrint, allowImageExport, allowPdfExport, a gradient on a pointer or
    // range), but those options can be switched on after creation, so always bring all of them.
    LinearGauge.Inject(Annotations, GaugeTooltip, Print, ImageExport, PdfExport, Gradient);
  }

  protected appendWidget() {
    ensureHostId(this.widgetElement, 'linearGauge');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the gauge has no `created` event and ignores every property but these after it rendered
    refreshOnPropertyChange(this, this.widget, [
      'height', 'width', 'margin', 'title', 'titleStyle', 'border', 'background', 'container', 'orientation', 'axes'
    ]);
  }

  protected onWidgetCreated() {
  }
}
