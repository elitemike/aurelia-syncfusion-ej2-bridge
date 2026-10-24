import { Carousel, CarouselModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("carousel")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-carousel')
export class Ej2Carousel extends SyncfusionWrapper<Carousel, CarouselModel> {
  protected syncfusionWidgetType = Carousel;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
