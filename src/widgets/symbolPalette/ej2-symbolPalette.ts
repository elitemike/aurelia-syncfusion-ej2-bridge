import { SymbolPalette, SymbolPaletteModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';
import { moveIdToHost, assignEventPlaceholders } from '../diagram/diagramHelpers';

@generateBindables("symbolPalette")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-symbol-palette')
export class Ej2SymbolPalette extends SyncfusionWrapper<SymbolPalette, SymbolPaletteModel> {
  protected syncfusionWidgetType = SymbolPalette;

  protected appendWidget() {
    moveIdToHost(this.element, this.widgetElement, 'symbolPalette');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    assignEventPlaceholders(this.widget, this.getBindables().bindableEvents, constants.eventPrefix);
  }

  protected onWidgetCreated() {
  }
}
