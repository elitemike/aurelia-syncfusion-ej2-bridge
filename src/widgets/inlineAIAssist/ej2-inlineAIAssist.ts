import { InlineAIAssist, InlineAIAssistModel } from '@syncfusion/ej2-interactive-chat';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("inlineAIAssist")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-inline-ai-assist')
export class Ej2InlineAIAssist extends SyncfusionWrapper<InlineAIAssist, InlineAIAssistModel> {
  protected syncfusionWidgetType = InlineAIAssist;

  protected onBeforeWidgetInstantiation() {
    // the popup, editor and response parts derive their ids from the host id
    if (!this.widgetElement.id) {
      this.widgetElement.id = `inline-ai-assist-${nextId++}`;
    }
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  detached() {
    // the popup is appended outside of the host, destroy takes it away together with the host
    super.detached();
  }
}
