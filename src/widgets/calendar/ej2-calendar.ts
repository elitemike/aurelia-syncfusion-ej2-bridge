import { Calendar, CalendarModel } from '@syncfusion/ej2-calendars';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("calendar")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-calendar')
export class Ej2Calendar extends SyncfusionWrapper<Calendar, CalendarModel> {
  protected syncfusionWidgetType = Calendar;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
