import { SyncfusionWrapper } from "common/syncfusionWrapper";
import { Slider, SliderModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "utilities/decorator";

@generateBindables("slider")
export class Ej2Slider extends SyncfusionWrapper<Slider, SliderModel> {
  protected syncfusionWidgetType = Slider;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
