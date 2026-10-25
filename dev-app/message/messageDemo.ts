export class MessageDemo {
  severities = ['Normal', 'Success', 'Info', 'Warning', 'Error'];
  variants = ['Text', 'Outlined', 'Filled'];

  content = 'This is a message';
  severity = 'Normal';
  variant = 'Text';
  showIcon = true;
  showClose = false;
  created = 0;

  visible = true;
  closedCount = 0;
  interacted: any = '';

  exists = true;
  destroyed = 0;

  onClosed(event: CustomEvent) {
    this.closedCount++;
    this.interacted = event.detail.isInteracted;
  }
}
