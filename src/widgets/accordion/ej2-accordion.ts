import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Accordion, AccordionModel } from "@syncfusion/ej2-navigations";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
import { inlineView, customElement } from "aurelia-framework";
enableRipple(true);

@generateBindables("accordion")
@customElement('ej2-accordion')
@inlineView('<template><div element.ref="widgetElement"></div></template>')
export class Ej2Accordion extends SyncfusionWrapper<Accordion, AccordionModel>{
  protected syncfusionWidgetType = Accordion

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
