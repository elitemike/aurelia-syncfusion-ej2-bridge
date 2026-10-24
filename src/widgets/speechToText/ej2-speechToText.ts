import { SpeechToText, SpeechToTextModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("speechToText")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-speech-to-text')
export class Ej2SpeechToText extends SyncfusionWrapper<SpeechToText, SpeechToTextModel> {
  protected syncfusionWidgetType = SpeechToText;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
