import { Carousel, CarouselModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("carousel")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-carousel')
export class Ej2Carousel extends SyncfusionWrapper<Carousel, CarouselModel> {
  protected syncfusionWidgetType = Carousel;
  private onSlideChanged: (args: any) => void = null;

  protected onWidgetCreated() {
  }

  // Carousel has no created event, so onWidgetCreated is never called. Hook up in onWrapperCreated instead.
  protected onWrapperCreated() {
    // slides change through the buttons, indicators, autoplay and swipes, write the index back to the binding
    this.onSlideChanged = (args) => {
      this[`${constants.bindablePrefix}selectedIndex`] = args.currentIndex;
    };
    this.widget.addEventListener('slideChanged', this.onSlideChanged);
  }

  public detached() {
    if (this.widget) {
      this.widget.removeEventListener('slideChanged', this.onSlideChanged);
    }
    super.detached();
  }
}
