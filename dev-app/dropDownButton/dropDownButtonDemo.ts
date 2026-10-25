export class DropDownButtonDemo {
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

  animation = { effect: 'SlideDown', duration: 100, easing: 'ease' };
  itemTemplate = '<div class="ddb-tpl" data-text="${text}">tpl ${text}</div>';
  htmlContent = '<b class="ddb-bold">Bold</b><img src=x onerror="window.__ddbXss=true">';
}
