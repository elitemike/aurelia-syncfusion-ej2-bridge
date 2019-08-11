import { TaskQueue } from 'aurelia-task-queue';
import { Disposable } from 'aurelia-binding';
import { Subscription } from "aurelia-event-aggregator"
import { RadioButtonModel, RadioButton } from '@syncfusion/ej2-buttons';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { constants } from 'common/constants';
import { generateBindables } from 'utilities/decorator';

@generateBindables("radio")
export class Ej2Radio extends SyncfusionWrapper<RadioButton, RadioButtonModel> {
  protected syncfusionWidgetType = RadioButton;

  checkedSubscription: Disposable = null;
  selectionChangedSubscription: Subscription = null;


  onBind() {
    if (!this.eModel.name) {
      throw "Radio e-name is required";
    }

    this.widget.change = () => {
      this[`${constants.bindablePrefix}checked`] = this.widget.checked;
      this.eventAggregator.publish(`ej2-radio-${this.eModel.name}-changed`, this[`${constants.bindablePrefix}label`]);
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, this[`${constants.bindablePrefix}checked`]).subscribe((newValue) => {
      this.widget.checked = newValue;
    });

    this.selectionChangedSubscription = this.eventAggregator.subscribe(`ej2-radio-${this.eModel.name}-changed`, (selectedLabel: string) => {
      if (this[`${constants.bindablePrefix}label`] !== selectedLabel) {
        this[`${constants.bindablePrefix}checked`] = false;
      }
    });
  }


  detached() {
    this.checkedSubscription.dispose();
    this.selectionChangedSubscription.dispose();
    super.detached();
  }
}



