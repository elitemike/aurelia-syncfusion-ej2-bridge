import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { MaskedTextBox, MaskedTextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

@generateBindables("maskedTextBox")
export class Ej2MaskedTextBox extends SyncfusionWrapper<MaskedTextBox, MaskedTextBoxModel>{
  protected syncfusionWidgetType = MaskedTextBox;
  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
