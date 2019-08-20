import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { Switch, SwitchModel } from '@syncfusion/ej2-buttons';
import { generateBindables } from 'utilities/decorator';

@generateBindables("switch")
export class Ej2Switch extends SyncfusionWrapper<Switch, SwitchModel> {
  protected syncfusionWidgetType = Switch;
  private id = null;

  protected onWrapperCreated() {
    this.id = this.element.getAttribute("id");

    if (this.id) {
      this.element.removeAttribute("id");
    }

    this.widgetElement.setAttribute("id", this.id);
  }

  protected onWidgetCreated() {
  }

  public recreate() {
    if (this.id) {
      this.widgetElement.removeAttribute("id");
    }

    this.element.setAttribute("id", this.id);
    super.recreate();
  }
}
