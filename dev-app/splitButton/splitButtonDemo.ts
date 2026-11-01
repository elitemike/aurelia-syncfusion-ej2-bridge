import { Ej2SplitButton } from 'widgets/splitButton/ej2-splitButton';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2SplitButton)
export class SplitButtonDemo {
  items = [
    { text: 'Dashboard', iconCss: 'e-icons e-home' },
    { text: 'Profile', iconCss: 'e-icons e-user' },
    { separator: true },
    { text: 'Log out', disabled: true }
  ];
  content = 'Menu';
  iconPosition = 'Left';
  disabled = false;
  created = 0;
  itemRenders = 0;
  beforeOpen = 0;
  opened = 0;
  beforeClose = 0;
  closed = 0;
  selected = '';
  primaryClicks = 0;

  animation = { effect: 'SlideDown', duration: 100, easing: 'ease' };
  itemTemplate = '<div class="sdb-tpl" data-text="${text}">tpl ${text}</div>';
  htmlContent = '<b class="sdb-bold">Bold</b><img src=x onerror="window.__sdbXss=true">';
}
