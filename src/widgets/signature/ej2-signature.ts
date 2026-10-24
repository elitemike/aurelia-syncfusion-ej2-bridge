import { Signature, SignatureModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

// The canvas sizes itself from its CSS box when the widget is appended, so it has to fill the (block level) host.
@generateBindables("signature")
@inlineView('<template><canvas element.ref="widgetElement" style="display:block;width:100%;height:100%"></canvas></template>')
@customElement('ej2-signature')
export class Ej2Signature extends SyncfusionWrapper<Signature, SignatureModel> {
  protected syncfusionWidgetType = Signature;

  protected onWrapperCreated() {
    const host = this.element as HTMLElement;
    if (!host.style.display) {
      host.style.display = 'block';
    }

    // Signature raises `created` twice (once from its own initialize and once from the component lifecycle),
    // let the consumer see it once.
    const widget: any = this.widget;
    const trigger = widget.trigger;
    let created = false;
    widget.trigger = function (eventName: string, ...rest: any[]) {
      if (eventName === 'created') {
        if (created) {
          return;
        }
        created = true;
      }
      return trigger.apply(widget, [eventName, ...rest]);
    };
  }

  protected onWidgetCreated() {
    // The initial `disabled` and `isReadOnly` values are only honoured by the widget when they change later,
    // apply them the way the widget does for a change so a signature that starts disabled really is.
    const widget: any = this.widget;
    if (widget.disabled) {
      widget.propertyChanged('disabled', true);
    }
    if (widget.isReadOnly) {
      widget.propertyChanged('isReadOnly', true);
    }
  }
}
