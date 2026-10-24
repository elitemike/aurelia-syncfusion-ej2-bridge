import { Calendar, CalendarModel, ChangedEventArgs, Islamic } from '@syncfusion/ej2-calendars';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("calendar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-calendar')
export class Ej2Calendar extends SyncfusionWrapper<Calendar, CalendarModel> {
  protected syncfusionWidgetType = Calendar;

  protected onBeforeWidgetInstantiation() {
    // calendarMode "Islamic" throws without the module, and the mode can be switched at runtime
    Calendar.Inject(Islamic);
  }

  protected onWrapperCreated() {
  }

  // The calendar mode is only read while the widget renders (it decides whether the Islamic module is
  // instantiated), so changing it later means building the widget again.
  calendarModeChanged() {
    if (this.widget && this.widget.calendarMode !== this[`${constants.bindablePrefix}calendarMode`]) {
      this.recreate();
    }
  }

  recreating() {
    // recreate() subscribes to the bindables again, drop the subscriptions of the widget that is going away
    this.subscriptions.forEach(subscription => subscription && subscription.dispose());
    this.subscriptions = [];
  }

  protected onWidgetCreated() {
    this.widget.addEventListener("change", (args: ChangedEventArgs) => {
      this[`${constants.bindablePrefix}value`] = args.value;
      if (this.widget.isMultiSelection) {
        this[`${constants.bindablePrefix}values`] = args.values;
      }
    });
  }
}
