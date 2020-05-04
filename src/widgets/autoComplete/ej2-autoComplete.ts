import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { AutoComplete, AutoCompleteModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";
import { customElement, inlineView } from "aurelia-framework";

@generateBindables("autoComplete")
@customElement('ej2-auto-complete')
@inlineView('<template><input element.ref="widgetElement" type="text" /></template>')
export class Ej2AutoComplete extends SyncfusionWrapper<AutoComplete, AutoCompleteModel> {
  protected syncfusionWidgetType = AutoComplete;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
