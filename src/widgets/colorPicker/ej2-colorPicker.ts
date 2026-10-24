import { ColorPicker, ColorPickerModel, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("colorPicker")
@inlineView('<template><input element.ref="widgetElement" type="color" /></template>')
@customElement('ej2-color-picker')
export class Ej2ColorPicker extends SyncfusionWrapper<ColorPicker, ColorPickerModel> {
  protected syncfusionWidgetType = ColorPicker;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // `change` carries the applied colour, `select` is raised while browsing before the colour is applied.
    // The widget raises `change` before it stores the new value, so take the value from the event arguments.
    this.widget.addEventListener("change", (args: ColorPickerEventArgs) => {
      if (args.value !== undefined) {
        this[`${constants.bindablePrefix}value`] = args.value;
      }
    });
  }
}
