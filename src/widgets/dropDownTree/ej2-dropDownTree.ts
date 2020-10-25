import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DropDownTree, DropDownTreeModel } from '@syncfusion/ej2-dropdowns';
import { generateBindables } from "../../utilities/decorator";
import { inlineView, customElement } from "aurelia-framework";
import { constants } from './../../common/constants';


@generateBindables("dropDownTree")
@customElement('ej2-drop-down-tree')
@inlineView('<template><input type="text" element.ref="widgetElement" /></template>')
export class Ej2DropDownTree extends SyncfusionWrapper<DropDownTree, DropDownTreeModel>{
  protected syncfusionWidgetType = DropDownTree

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
