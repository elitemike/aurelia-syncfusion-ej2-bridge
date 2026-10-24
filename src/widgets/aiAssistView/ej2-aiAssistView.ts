import { AIAssistView, AIAssistViewModel } from '@syncfusion/ej2-interactive-chat';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("aiAssistView")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ai-assist-view')
export class Ej2AIAssistView extends SyncfusionWrapper<AIAssistView, AIAssistViewModel> {
  protected syncfusionWidgetType = AIAssistView;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
