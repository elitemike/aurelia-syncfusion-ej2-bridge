import { Ej2Toast } from 'widgets/toast/ej2-toast';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Toast)
export class ToastDemo {
  basic: any;
  timeout: any;
  position: any;
  anim: any;
  buttonsToast: any;
  template: any;
  order: any;
  sanitize: any;

  content = 'Your changes were saved';
  showClose = true;
  created = 0;
  beforeOpen = 0;
  opened = 0;
  beforeClose = 0;
  closed = 0;
  clicks = 0;

  animation = { show: { effect: 'FadeZoomIn', duration: 100 }, hide: { effect: 'FadeZoomOut', duration: 100 } };

  action = '';
  buttons = [
    { model: { content: 'Retry', cssClass: 'e-primary' }, click: () => { this.action = 'retry'; } },
    { model: { content: 'Dismiss' }, click: () => { this.action = 'dismiss'; this.buttonsToast.widget.hide('All'); } }
  ];

  toastTemplate = '<div class="ts-template-content"><b>Custom</b> template toast</div>';

  htmlContent = '<b data-testid="ts-html">Bold</b><img src="x" onerror="window.__tsXss = true"><script>window.__tsScript = true</script>';
  sanitized = 0;

  exists = true;
  destroyed = 0;
}
