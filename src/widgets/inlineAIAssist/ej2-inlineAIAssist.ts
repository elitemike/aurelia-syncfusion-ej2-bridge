import { InlineAIAssist, InlineAIAssistModel } from '@syncfusion/ej2-interactive-chat';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("inlineAIAssist")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-inline-ai-assist')
export class Ej2InlineAIAssist extends SyncfusionWrapper<InlineAIAssist, InlineAIAssistModel> {
  protected syncfusionWidgetType = InlineAIAssist;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
