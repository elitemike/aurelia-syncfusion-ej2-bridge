import { Mention, MentionModel } from '@syncfusion/ej2-dropdowns';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("mention")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-mention')
export class Ej2Mention extends SyncfusionWrapper<Mention, MentionModel> {
  protected syncfusionWidgetType = Mention;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
