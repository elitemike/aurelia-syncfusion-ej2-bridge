import { Skeleton, SkeletonModel } from '@syncfusion/ej2-notifications';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("skeleton")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-skeleton')
export class Ej2Skeleton extends SyncfusionWrapper<Skeleton, SkeletonModel> {
  protected syncfusionWidgetType = Skeleton;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
