import { SymbolPalette, SymbolPaletteModel } from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("symbolPalette")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-symbol-palette')
export class Ej2SymbolPalette extends SyncfusionWrapper<SymbolPalette, SymbolPaletteModel> {
  protected syncfusionWidgetType = SymbolPalette;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
