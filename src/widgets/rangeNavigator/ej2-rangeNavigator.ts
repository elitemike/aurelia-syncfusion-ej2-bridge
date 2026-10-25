import {
  RangeNavigator, RangeNavigatorModel, AreaSeries, StepLineSeries, SplineSeries, SplineAreaSeries, ColumnSeries,
  DateTime, Logarithmic, DateTimeCategory, RangeTooltip, PeriodSelector
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let rangeNavigatorIndex = 0;

@generateBindables("rangeNavigator")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-range-navigator')
export class Ej2RangeNavigator extends SyncfusionWrapper<RangeNavigator, RangeNavigatorModel> {
  protected syncfusionWidgetType = RangeNavigator;

  // RangeNavigator.Inject registers modules globally and the navigator only activates the ones its options require
  // (requiredModules: the series types, the axis value type, the tooltip and the period selector). Register all of
  // them up front so that changing series, valueType, tooltip.enable or the periods at runtime finds them.
  protected onBeforeWidgetInstantiation() {
    RangeNavigator.Inject(AreaSeries, StepLineSeries, SplineSeries, SplineAreaSeries, ColumnSeries, DateTime, Logarithmic,
      DateTimeCategory, RangeTooltip, PeriodSelector);
  }

  // The navigator derives the ids of its svg elements from the host id, give every host its own.
  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `ej2-range-navigator-${++rangeNavigatorIndex}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the selected range is the user editable state, report it back whenever the thumbs, the selected region or a
    // period button moved it
    this.widget.addEventListener('changed', (args: any) => {
      this.onChanged(args);
    });
  }

  protected onWidgetCreated() {
  }

  // Width and height are stored but the navigator never recomputes its svg size from them (onPropertyChanged only
  // redraws inside the old size), so re-render the whole widget when they change.
  protected widthChanged(value: any) { this.setAndRefresh('width', value); }
  protected heightChanged(value: any) { this.setAndRefresh('height', value); }

  private setAndRefresh(name: string, value: any) {
    if (!this.widget) { return; }
    (this.widget as any).setProperties({ [name]: value }, true);
    this.widget.refresh();
  }

  onChanged(args: { start: any, end: any }) {
    const value = [args.start, args.end];
    // keep the widget model in sync without rendering, the slider is already where the user put it
    (this.widget as any).setProperties({ value }, true);
    this[`${constants.bindablePrefix}value`] = value;
  }
}
