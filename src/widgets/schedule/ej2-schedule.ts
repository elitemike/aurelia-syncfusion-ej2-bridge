import { inlineView, customElement } from 'aurelia-framework';
import {
  Schedule, ScheduleModel, TimelineViews, TimelineMonth, ResourceDetails,
  PopupOpenEventArgs, RenderCellEventArgs, EventRenderedArgs, ActionEventArgs, 
  Resize, DragAndDrop, Day, Week, WorkWeek, Month, Agenda, TimelineYear, ExcelExport,ICalendarExport, ICalendarImport, Print
} from '@syncfusion/ej2-schedule';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from  '../../common/syncfusionWrapper';


@generateBindables("radio")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-schedule')
export class Ej2Schedule extends SyncfusionWrapper<Schedule, ScheduleModel> {
  protected syncfusionWidgetType: any = Schedule;
  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }

  onBeforeWidgetInstantiation(){
    Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, 
      TimelineYear, DragAndDrop, Resize, ExcelExport, ICalendarExport, ICalendarImport, Print);
  }
}
