import { DOM } from 'aurelia-pal';
import { Disposable } from 'aurelia-binding';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { bindable, autoinject } from 'aurelia-framework';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';

@autoinject
@generateBindables("checkbox")
export class Ej2Checkbox extends SyncfusionWrapper<CheckBox, CheckBoxModel> {

  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {
  }

  protected syncfusionWidgetType = CheckBox;


  checkedSubscription: Disposable = null;

  onBind() {
    this.widget.change = () => {
      this[`${constants.bindablePrefix}checked`] = this.widget.checked;
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, "checked").subscribe((newValue) => {
      this.widget.checked = newValue;
    });
  }


  _onClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.taskQueue.queueTask(() => {
      let clickEvent = new CustomEvent("on-click", {
        bubbles: true,
        detail: { checked: this[`${constants.bindablePrefix}checked`] }
      });

      this.element.dispatchEvent(clickEvent);
    });
  }


  detached() {
    this.checkedSubscription.dispose();
    super.detached();
  }
}