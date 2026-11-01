import { Ej2Dialog } from 'widgets/dialog/ej2-dialog';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Dialog)
export class DialogDemo {
  basicVisible = false;
  showClose = true;
  isModal = true;
  closeOnEscape = true;
  created = 0;
  beforeOpen = 0;
  openCount = 0;
  beforeClose = 0;
  closeCount = 0;
  overlayClicks = 0;

  contentVisible = false;
  htmlContent = '<b data-testid="dlg-html">Bold</b><img src="x" onerror="window.__dlgXss = true"><script>window.__dlgScript = true</script>';
  sanitize = true;
  sanitized = 0;

  targetVisible = false;

  dragVisible = false;
  dragStart = 0;
  dragMove = 0;
  dragStop = 0;
  resizeStart = 0;
  resizing = 0;
  resizeStop = 0;

  buttonsVisible = false;
  answer = '';
  buttons = [
    { buttonModel: { content: 'Yes', isPrimary: true }, click: () => { this.answer = 'yes'; this.buttonsVisible = false; } },
    { buttonModel: { content: 'No' }, click: () => { this.answer = 'no'; this.buttonsVisible = false; } }
  ];

  footerVisible = false;
  footerTemplate = '<span class="dlg-footer-content">Custom footer</span>';

  exists = true;
  destroyed = 0;
}
