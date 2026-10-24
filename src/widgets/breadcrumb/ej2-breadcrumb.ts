import { Breadcrumb, BreadcrumbModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("breadcrumb")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-breadcrumb')
export class Ej2Breadcrumb extends SyncfusionWrapper<Breadcrumb, BreadcrumbModel> {
  protected syncfusionWidgetType = Breadcrumb;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
