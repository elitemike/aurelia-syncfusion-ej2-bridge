import { TreeMap, TreeMapModel, TreeMapTooltip, TreeMapHighlight, TreeMapSelection, TreeMapLegend, Print, ImageExport, PdfExport } from '@syncfusion/ej2-treemap';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { ensureHostId, refreshOnPropertyChange } from '../visualizationHelpers';

@generateBindables("treeMap")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tree-map')
export class Ej2TreeMap extends SyncfusionWrapper<TreeMap, TreeMapModel> {
  protected syncfusionWidgetType = TreeMap;

  protected onBeforeWidgetInstantiation() {
    // TreeMap.Inject registers modules globally. The tree map only activates a module when its option asks for it
    // (tooltipSettings.visible, highlightSettings.enable, selectionSettings.enable, legendSettings.visible,
    // allowPrint, allowImageExport, allowPdfExport), but those options can be switched on after creation, so always
    // bring all of them.
    TreeMap.Inject(TreeMapTooltip, TreeMapHighlight, TreeMapSelection, TreeMapLegend, Print, ImageExport, PdfExport);
  }

  protected appendWidget() {
    ensureHostId(this.widgetElement, 'treeMap');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // the tree map has no `created` event and ignores every property but these after it rendered
    refreshOnPropertyChange(this, this.widget, [
      'background', 'height', 'width', 'layoutType', 'levels', 'drillDownView', 'renderDirection', 'leafItemSettings',
      'legendSettings', 'dataSource'
    ]);
  }

  protected onWidgetCreated() {
  }
}
