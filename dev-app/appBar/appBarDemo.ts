import { Ej2AppBar } from 'widgets/appBar/ej2-appBar';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2AppBar)
export class AppBarDemo {
  // default
  menuClicks = 0;
  createdCount = 0;
  destroyedCount = 0;
  showBar = true;

  // modes and colors
  mode = 'Regular';
  colorMode = 'Light';

  // position and sticky
  position = 'Top';
  sticky = false;

  // customization
  cssClass = 'ab-one';
  htmlAttributes = { 'data-custom': 'yes', 'aria-label': 'Main navigation' };

  onCreated() { this.createdCount++; }
  onDestroyed() { this.destroyedCount++; }
  menuClick() { this.menuClicks++; }
  toggle() { this.showBar = !this.showBar; }
  prominent() { this.mode = 'Prominent'; }
  dense() { this.mode = 'Dense'; }
  dark() { this.colorMode = 'Dark'; }
  primary() { this.colorMode = 'Primary'; }
  bottom() { this.position = 'Bottom'; }
  stick() { this.sticky = true; }
  restyle() { this.cssClass = 'ab-two'; }
  attrs() { this.htmlAttributes = { 'data-custom': 'changed', 'aria-label': 'Secondary navigation' }; }
}
