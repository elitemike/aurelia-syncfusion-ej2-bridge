import { Ej2Accordion } from 'widgets/accordion/ej2-accordion';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Accordion)
export class AccordionDemo {
  items = [
    { header: 'ASP.NET', expanded: true, content: 'Microsoft ASP.NET is a set of technologies for building web applications.' },
    { header: 'ASP.NET MVC', content: 'The Model-View-Controller pattern separates an application into three components.' },
    { header: 'JavaScript', content: 'JavaScript is an interpreted programming language that runs in web browsers.' }
  ];
  plainItems = [{ header: 'One', content: 'First' }, { header: 'Two', content: 'Second' }, { header: 'Three', content: 'Third' }];
  expandMode = 'Single';
  expanding = 0;
  expanded = 0;
  lastHeader = '';
  showAccordion = true;
  clicked = 0;
  created = 0;
  destroyed = 0;
  sanitize = true;
  records = [
    { header: 'Alpha', content: 'alpha body' },
    { header: 'Beta', content: 'beta body' }
  ];
  headerTemplate = '<div class="tpl-head">H: ${header}</div>';
  itemTemplate = '<div class="tpl-body">B: ${content}</div>';
  animation = { expand: { effect: 'None', duration: 0 }, collapse: { effect: 'None', duration: 0 } };

  onClicked() {
    this.clicked++;
  }


  onExpanding() {
    this.expanding++;
  }

  onExpanded(event: CustomEvent) {
    this.expanded++;
    this.lastHeader = event.detail.item && event.detail.item.header;
  }

  setMode(mode: string) {
    this.expandMode = mode;
  }

  toggle() {
    this.showAccordion = !this.showAccordion;
  }
}
