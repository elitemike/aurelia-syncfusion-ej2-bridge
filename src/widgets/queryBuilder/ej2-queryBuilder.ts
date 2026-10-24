import { QueryBuilder, QueryBuilderModel } from '@syncfusion/ej2-querybuilder';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("queryBuilder")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-query-builder')
export class Ej2QueryBuilder extends SyncfusionWrapper<QueryBuilder, QueryBuilderModel> {
  protected syncfusionWidgetType = QueryBuilder;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
