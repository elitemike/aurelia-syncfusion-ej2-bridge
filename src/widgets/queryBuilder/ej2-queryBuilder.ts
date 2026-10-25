import { QueryBuilder, QueryBuilderModel } from '@syncfusion/ej2-querybuilder';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("queryBuilder")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-query-builder')
export class Ej2QueryBuilder extends SyncfusionWrapper<QueryBuilder, QueryBuilderModel> {
  protected syncfusionWidgetType = QueryBuilder;

  protected onWrapperCreated() {
  }

  private sameRule(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // rule is two-way: the widget reports every change through ruleChange, a new rule from the view-model is applied
  // unless it is the rule the widget already holds (otherwise the write-back would echo forever)
  protected ruleChanged(value: any) {
    if (this.widget && value && !this.sameRule(value, this.widget.getRules())) {
      this.widget.setRules(value);
    }
  }

  protected onWidgetCreated() {
    const key = `${constants.bindablePrefix}rule`;
    const report = () => {
      const rule = this.widget.getRules();
      if (!this.sameRule(rule, this[key])) {
        this[key] = rule;
      }
    };
    this.widget.addEventListener("ruleChange", report);
    this.widget.addEventListener("change", report);
  }
}
