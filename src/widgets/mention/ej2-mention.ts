import { Mention, MentionModel } from '@syncfusion/ej2-dropdowns';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("mention")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-mention')
export class Ej2Mention extends SyncfusionWrapper<Mention, MentionModel> {
  protected syncfusionWidgetType = Mention;

  protected onWrapperCreated() {
    // Without a `target` the mention works on its own element, which therefore has to be editable. With a
    // target (another editable element, selector or element) the own element is just the widget anchor.
    if (!this[`${constants.bindablePrefix}target`]) {
      this.widgetElement.setAttribute("contenteditable", "true");
      this.widgetElement.setAttribute("role", "textbox");
    }
  }

  protected onWidgetCreated() {
  }
}
