import {
  Ribbon, RibbonModel, RibbonButton, RibbonCheckBox, RibbonColorPicker, RibbonComboBox, RibbonDropDown,
  RibbonGallery, RibbonGroupButton, RibbonSplitButton, RibbonFileMenu, RibbonBackstage, RibbonContextualTab,
  RibbonKeyTip
} from '@syncfusion/ej2-ribbon';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("ribbon")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-ribbon')
export class Ej2Ribbon extends SyncfusionWrapper<Ribbon, RibbonModel> {
  protected syncfusionWidgetType = Ribbon;
  private onTabSelected: (args: any) => void = null;
  private onToggle: () => void = null;

  protected onBeforeWidgetInstantiation() {
    // Ribbon.Inject registers modules globally. The ribbon only instantiates the ones its model needs
    // (file menu, backstage, color picker, gallery, contextual tabs, key tips), so register them all.
    Ribbon.Inject(RibbonButton, RibbonDropDown, RibbonSplitButton, RibbonCheckBox, RibbonComboBox, RibbonGroupButton,
      RibbonColorPicker, RibbonGallery, RibbonFileMenu, RibbonBackstage, RibbonContextualTab, RibbonKeyTip);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    this.onTabSelected = (args) => {
      this[`${constants.bindablePrefix}selectedTab`] = args.selectedIndex;
    };
    // the expanding and collapsing events are raised before isMinimized is updated, read it once they are done
    this.onToggle = () => {
      setTimeout(() => {
        if (this.widget) {
          this[`${constants.bindablePrefix}isMinimized`] = this.widget.isMinimized;
        }
      });
    };
    this.widget.addEventListener('tabSelected', this.onTabSelected);
    this.widget.addEventListener('ribbonExpanding', this.onToggle);
    this.widget.addEventListener('ribbonCollapsing', this.onToggle);
  }

  public detached() {
    if (this.widget) {
      this.widget.removeEventListener('tabSelected', this.onTabSelected);
      this.widget.removeEventListener('ribbonExpanding', this.onToggle);
      this.widget.removeEventListener('ribbonCollapsing', this.onToggle);
    }
    super.detached();
  }
}
