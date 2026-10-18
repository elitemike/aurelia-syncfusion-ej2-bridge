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
