import { Breadcrumb, BreadcrumbModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("breadcrumb")
@inlineView('<template><nav element.ref="widgetElement"></nav></template>')
@customElement('ej2-breadcrumb')
export class Ej2Breadcrumb extends SyncfusionWrapper<Breadcrumb, BreadcrumbModel> {
  protected syncfusionWidgetType = Breadcrumb;
  private onItemClick: () => void = null;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // a click on an item makes it the active one (unless itemClick was cancelled), write it back to the binding
    this.onItemClick = () => {
      setTimeout(() => {
        if (this.widget) {
          this[`${constants.bindablePrefix}activeItem`] = this.widget.activeItem;
        }
      });
    };
    this.widget.addEventListener('itemClick', this.onItemClick);
  }

  // The widget only generates items from url while it has none, so clear them first.
  public urlChanged(url: string) {
    if (this.widget) {
      this.widget.setProperties({ items: [], url });
    }
  }

  public detached() {
    if (this.widget) {
      this.widget.removeEventListener('itemClick', this.onItemClick);
    }
    super.detached();
  }
}
