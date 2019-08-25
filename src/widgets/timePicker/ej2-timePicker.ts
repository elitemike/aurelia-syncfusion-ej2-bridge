import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { TimePicker, TimePickerModel } from "@syncfusion/ej2-calendars";
import { generateBindables } from '../../utilities/decorator';

@generateBindables("timePicker")
export class Ej2TimePicker extends SyncfusionWrapper<TimePicker, TimePickerModel> {
  protected syncfusionWidgetType = TimePicker;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
