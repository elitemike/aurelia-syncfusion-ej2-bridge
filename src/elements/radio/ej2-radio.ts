import { TaskQueue } from 'aurelia-task-queue';
import { BindingEngine, Disposable } from 'aurelia-binding';
import { bindable, autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from "aurelia-event-aggregator"
import { RadioButtonModel, RadioButton } from '@syncfusion/ej2-buttons';

@autoinject
export class Ej2Radio {
  @bindable
  label: string = "No label provided";
  @bindable
  name: string = "";
  @bindable
  settings = null;
  @bindable
  checked: boolean = false

  radioButton: RadioButton = null;
  radioButtonModel: RadioButtonModel = {};
  context: any = null;
  radioElement: HTMLInputElement = null;
  checkedSubscription: Disposable = null;
  selectionChangedSubscription: Subscription = null;

  constructor(private bindingEngine: BindingEngine, private taskQueue: TaskQueue, private eventAggregator: EventAggregator) {

  }

  bind(context) {

    this.context = context;

    this.radioButtonModel.label = this.label;
    this.radioButtonModel.name = this.name;
    if (this.checked) {
      this.radioButtonModel.checked = this.checked;
    }


    if (this.settings) {
      Object.assign(this.radioButtonModel, this.settings);
    }

    if (!this.radioButtonModel.name) {
      throw "Radio name is required";
    }



    this.radioButton = new RadioButton(this.radioButtonModel);
    let _this = this;
    this.radioButton.change = () => {
      this.checked = this.radioButton.checked;
      this.eventAggregator.publish(`ej2-radio-${this.radioButtonModel.name}-changed`, this.label);
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, "checked").subscribe((newValue) => {
      this.radioButton.checked = newValue;
    });

    this.selectionChangedSubscription = this.eventAggregator.subscribe(`ej2-radio-${this.radioButtonModel.name}-changed`, (selectedLabel: string) => {
      if (this.label !== selectedLabel) {
        this.checked = false;
      }
    });
  }

  attached() {
    this.radioButton.appendTo(this.radioElement);
  }

  detached() {
    this.checkedSubscription.dispose();
    this.selectionChangedSubscription.dispose():
  }

}



