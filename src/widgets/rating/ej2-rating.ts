import { Rating, RatingModel, RatingChangedEventArgs } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("rating")
@inlineView('<template><input element.ref="widgetElement" /></template>')
@customElement('ej2-rating')
export class Ej2Rating extends SyncfusionWrapper<Rating, RatingModel> {
  protected syncfusionWidgetType = Rating;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // the widget raises valueChanged for user clicks, keyboard, reset and programmatic changes
    this.widget.addEventListener("valueChanged", (args: RatingChangedEventArgs) => {
      this[`${constants.bindablePrefix}value`] = args.value;
    });
  }
}
