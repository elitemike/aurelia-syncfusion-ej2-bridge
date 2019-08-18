import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { TextBox, TextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "utilities/decorator";

@generateBindables("textBox")
export class Ej2TextBox extends SyncfusionWrapper<TextBox, TextBoxModel>{
  protected syncfusionWidgetType = TextBox;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
