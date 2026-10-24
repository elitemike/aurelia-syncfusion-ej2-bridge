import { SpeechToText, SpeechToTextModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("speechToText")
@inlineView('<template><button element.ref="widgetElement"></button></template>')
@customElement('ej2-speech-to-text')
export class Ej2SpeechToText extends SyncfusionWrapper<SpeechToText, SpeechToTextModel> {
  protected syncfusionWidgetType = SpeechToText;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // The widget updates `transcript` and `listeningState` silently (no property change notification), so the
    // bindings are brought along from the widget events. The values are read once the event, including a
    // cancelled onStart, has been fully processed by the widget.
    const sync = () => {
      this.taskQueue.queueTask(() => {
        const widget: any = this.widget;
        if (!widget) {
          return;
        }
        this[`${constants.bindablePrefix}transcript`] = widget.transcript;
        this[`${constants.bindablePrefix}listeningState`] = widget.listeningState;
      });
    };
    ["onStart", "onStop", "transcriptChanged"].forEach(name => this.widget.addEventListener(name, sync));
  }
}
