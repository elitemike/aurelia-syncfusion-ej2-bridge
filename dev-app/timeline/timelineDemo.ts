export class TimelineDemo {
  items = [
    { content: 'Ordered\n9:15 AM, January 1, 2024', dotCss: 'state-success', cssClass: 'completed' },
    { content: 'Shipped\n12:20 PM, January 4, 2024', dotCss: 'state-success', cssClass: 'completed' },
    { content: 'Out for delivery\n07:00 AM, January 8, 2024', dotCss: 'state-progress', cssClass: 'intermediate' },
    { content: 'Delivered\nEstimated delivery by 09:20 AM' }
  ];
  orientation = 'Vertical';
  reverse = false;
}
