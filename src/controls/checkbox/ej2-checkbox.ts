import { Disposable } from 'aurelia-binding';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { bindable, autoinject } from 'aurelia-framework';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { generateBindables } from 'utilities/decorator';
import { constants } from 'common/constants';

@autoinject
@generateBindables("checkbox")
export class Ej2Checkbox extends SyncfusionWrapper<CheckBox, CheckBoxModel> {
  protected onCreated() {
  }
  protected syncfusionWidgetType = CheckBox;

  @bindable
  private onClick: Function = null;


  checkedSubscription: Disposable = null;

  onBind() {
    this.widget.change = () => {
      this[`${constants.bindablePrefix}checked`] = this.widget.checked;
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, "checked").subscribe((newValue) => {
      this.widget.checked = newValue;
    });
  }


  _onClick() {
    if (this.onClick) {
      this.taskQueue.queueTask(() => {

        this.onClick(this[`${constants.bindablePrefix}checked`]);
      });

      return true;
    }
  }


  detached() {
    this.checkedSubscription.dispose();
    super.detached();
  }
}
