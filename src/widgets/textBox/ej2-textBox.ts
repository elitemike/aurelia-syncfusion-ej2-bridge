import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { TextBox, TextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

@generateBindables("textBox")
export class Ej2TextBox extends SyncfusionWrapper<TextBox, TextBoxModel>{
  protected syncfusionWidgetType = TextBox;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("input", (args) => { _this.onInput(args) });
  }

  onInput(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
