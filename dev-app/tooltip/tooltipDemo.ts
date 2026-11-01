import { Ej2Tooltip } from 'widgets/tooltip/ej2-tooltip';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Tooltip)
export class TooltipDemo {
  content = 'Hello from the tooltip';
  position = 'TopCenter';
  offsetX = 0;
  showTip = true;
  created = 0;
  beforeRender = 0;
  beforeOpen = 0;
  afterOpen = 0;
  beforeClose = 0;
  afterClose = 0;

  html = '<b data-testid="tt-bold">Bold</b><img src="x" onerror="window.__ttXss = true">';
  parse = true;

  animation = { open: { effect: 'ZoomIn', duration: 100, delay: 0 }, close: { effect: 'ZoomOut', duration: 100, delay: 0 } };

  collisions = 0;

  exists = true;
  destroyed = 0;
}
