import { Maps, MapsModel } from '@syncfusion/ej2-maps';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("maps")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-maps')
export class Ej2Maps extends SyncfusionWrapper<Maps, MapsModel> {
  protected syncfusionWidgetType = Maps;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
