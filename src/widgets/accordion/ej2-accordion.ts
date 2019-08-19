import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { Accordion, AccordionModel } from "@syncfusion/ej2-navigations";
import { generateBindables } from "../../utilities/decorator";
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

@generateBindables("accordion")
export class Ej2Accordion extends SyncfusionWrapper<Accordion, AccordionModel>{
  protected syncfusionWidgetType = Accordion

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
