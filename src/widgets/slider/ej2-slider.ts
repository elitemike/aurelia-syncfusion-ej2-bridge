import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Slider, SliderModel, SliderChangeEventArgs } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("slider")
export class Ej2Slider extends SyncfusionWrapper<Slider, SliderModel> {
  protected syncfusionWidgetType = Slider;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("changed", (event: SliderChangeEventArgs) => {
      _this.onChanged(event);
    });
  }

  onChanged(event: SliderChangeEventArgs) {
    this[`${constants.bindablePrefix}value`] = event.value;
  }
}
