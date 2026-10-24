import { CircularGauge, CircularGaugeModel, Annotations, GaugeTooltip, Legend, Print, ImageExport, PdfExport, Gradient } from '@syncfusion/ej2-circulargauge';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { ensureHostId, refreshOnPropertyChange } from '../visualizationHelpers';

@generateBindables("circularGauge")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-circular-gauge')
export class Ej2CircularGauge extends SyncfusionWrapper<CircularGauge, CircularGaugeModel> {
  protected syncfusionWidgetType = CircularGauge;

  protected onBeforeWidgetInstantiation() {
    // CircularGauge.Inject registers modules globally. The gauge only activates a module when its option asks for it
    // (annotation content, tooltip.enable, legendSettings.visible, allowPrint, allowImageExport, allowPdfExport),
    // but those options can be switched on after creation, so always bring all of them.
    CircularGauge.Inject(Annotations, GaugeTooltip, Legend, Print, ImageExport, PdfExport, Gradient);
  }

  protected appendWidget() {
    ensureHostId(this.widgetElement, 'circularGauge');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the gauge has no `created` event and ignores every property but these after it rendered
    refreshOnPropertyChange(this, this.widget, [
      'width', 'height', 'centerX', 'centerY', 'margin', 'animationDuration', 'title', 'titleStyle', 'border',
      'background', 'legendSettings', 'axes'
    ]);
  }

  protected onWidgetCreated() {
  }
}
