import { ColorPicker, ColorPickerModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("colorPicker")
@inlineView('<template><input element.ref="widgetElement" /></template>')
@customElement('ej2-color-picker')
export class Ej2ColorPicker extends SyncfusionWrapper<ColorPicker, ColorPickerModel> {
  protected syncfusionWidgetType = ColorPicker;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
