import { Ej2Timeline } from 'widgets/timeline/ej2-timeline';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Timeline)
export class TimelineDemo {
  items = [
    { content: 'Ordered\n9:15 AM, January 1, 2024', dotCss: 'state-success', cssClass: 'completed' },
    { content: 'Shipped\n12:20 PM, January 4, 2024', dotCss: 'state-success', cssClass: 'completed' },
    { content: 'Out for delivery\n07:00 AM, January 8, 2024', dotCss: 'state-progress', cssClass: 'intermediate' },
    { content: 'Delivered\nEstimated delivery by 09:20 AM' }
  ];
  orientation = 'Vertical';
  reverse = false;

  simpleItems = [{ content: 'First' }, { content: 'Second' }, { content: 'Third' }];
  tpl = '<div class="tl-tpl">Item: ${item.content}</div>';
  createdCount = 0;
  renderedCount = 0;
  lastItem = '';

  onCreated() {
    this.createdCount++;
  }

  onBeforeItemRender(event: CustomEvent) {
    this.renderedCount++;
    this.lastItem = `${event.detail.index}:${event.detail.element.textContent}`;
  }
}
