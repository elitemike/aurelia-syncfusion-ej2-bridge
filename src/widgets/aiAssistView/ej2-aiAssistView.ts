import { AIAssistView, AIAssistViewModel, AssistThinking } from '@syncfusion/ej2-interactive-chat';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("aiAssistView")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ai-assist-view')
export class Ej2AIAssistView extends SyncfusionWrapper<AIAssistView, AIAssistViewModel> {
  protected syncfusionWidgetType = AIAssistView;

  protected onBeforeWidgetInstantiation() {
    // renders the thinking blocks of a response, the view requires it for every instance
    AIAssistView.Inject(AssistThinking);
    // prompt, response and attachment parts derive their ids from the host id
    if (!this.widgetElement.id) {
      this.widgetElement.id = `ai-assist-view-${nextId++}`;
    }
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
