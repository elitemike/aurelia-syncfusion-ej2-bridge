
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from 'utilities/decorator';
import { Timeline, TimelineModel } from '@syncfusion/ej2/layouts';

@generateBindables("timeline")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-timeline')
export class Ej2Timeline extends SyncfusionWrapper<Timeline, TimelineModel> {
    protected syncfusionWidgetType = Timeline;
    protected onWrapperCreated() {
    }

    protected onWidgetCreated() {
    }
}
