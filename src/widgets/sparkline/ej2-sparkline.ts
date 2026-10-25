import { Sparkline, SparklineModel, SparklineTooltip } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let sparklineIndex = 0;

@generateBindables("sparkline")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-sparkline')
export class Ej2Sparkline extends SyncfusionWrapper<Sparkline, SparklineModel> {
  protected syncfusionWidgetType = Sparkline;

  // Sparkline.Inject registers modules globally, the sparkline only activates the ones its options require
  // (mirrors Sparkline.requiredModules: tooltip or tracker line).
  protected onBeforeWidgetInstantiation() {
    const tooltip: any = (this._eModel as any).tooltipSettings;
    if (tooltip && (tooltip.visible || (tooltip.trackLineSettings && tooltip.trackLineSettings.visible))) {
      Sparkline.Inject(SparklineTooltip);
    }
  }

  // The sparkline derives the ids of its SVG elements from the host id, an auto generated or missing id collides
  // as soon as several sparklines share a page, so every host gets its own.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `ej2-sparkline-${++sparklineIndex}`;
    }
    super.appendWidget();
  }

  // Sparkline.onPropertyChanged only re-renders for a handful of properties (type, data, colors of the special points,
  // markers, labels, tooltip, theme, border...). The remaining ones are stored but never drawn, so refresh the widget.
  private setAndRefresh(name: string, value: any) {
    if (!this.widget) { return; }
    (this.widget as any).setProperties({ [name]: value }, true);
    this.widget.refresh();
  }

  protected widthChanged(value: any) { this.setAndRefresh('width', value); }
  protected heightChanged(value: any) { this.setAndRefresh('height', value); }
  protected fillChanged(value: any) { this.setAndRefresh('fill', value); }
  protected lineWidthChanged(value: any) { this.setAndRefresh('lineWidth', value); }
  protected opacityChanged(value: any) { this.setAndRefresh('opacity', value); }
  protected paletteChanged(value: any) { this.setAndRefresh('palette', value); }
  protected paddingChanged(value: any) { this.setAndRefresh('padding', value); }
  protected rangePaddingChanged(value: any) { this.setAndRefresh('rangePadding', value); }
  protected formatChanged(value: any) { this.setAndRefresh('format', value); }
  protected useGroupingSeparatorChanged(value: any) { this.setAndRefresh('useGroupingSeparator', value); }
  protected tiePointColorChanged(value: any) { this.setAndRefresh('tiePointColor', value); }
  protected containerAreaChanged(value: any) { this.setAndRefresh('containerArea', value); }
  protected queryChanged(value: any) { this.setAndRefresh('query', value); }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
