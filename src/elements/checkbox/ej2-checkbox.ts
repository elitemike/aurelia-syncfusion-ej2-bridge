import { TaskQueue } from 'aurelia-task-queue';
import { BindingEngine, Disposable } from 'aurelia-binding';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { bindable, autoinject } from 'aurelia-framework';

@autoinject
export class Ej2Checkbox {
  @bindable
  label: string = "No label provided";
  @bindable
  settings = null;
  @bindable
  checked: boolean = false
  @bindable
  private onClick: Function = null;

  checkBox: CheckBox = null;
  checkBoxModel: CheckBoxModel = {};
  context: any = null;
  checkboxElement: HTMLInputElement = null;
  checkedSubscription: Disposable = null;

  constructor(private bindingEngine: BindingEngine, private taskQueue: TaskQueue) {

  }

  bind(context) {
    this.context = context;

    this.checkBoxModel.label = this.label;
    this.checkBoxModel.checked = this.checked;


    if (this.settings) {
      Object.assign(this.checkBoxModel, this.settings);
    }

    this.checkBox = new CheckBox(this.checkBoxModel);
    this.checkBox.change = () => {
      this.checked = this.checkBox.checked;
    };

    this.checkedSubscription = this.bindingEngine.propertyObserver(this, "checked").subscribe((newValue) => {
      this.checkBox.checked = newValue;
    });
  }

  _onClick() {
    if (this.onClick) {
      this.taskQueue.queueTask(() => {
        this.onClick(this.checked);
      });

      return true;
    }
  }

  attached() {
    this.checkBox.appendTo(this.checkboxElement);
  }

  detached() {
    this.checkedSubscription.dispose();
  }
}
