import {
  Diagram, DiagramModel, UndoRedo, DiagramContextMenu, Snapping, PrintAndExport, BpmnDiagrams, ConnectorBridging,
  ConnectorEditing, DataBinding, HierarchicalTree, MindMap, RadialTree, ComplexHierarchicalTree, SymmetricLayout,
  FlowchartLayout, LineRouting, AvoidLineOverlapping, LineDistribution, LayoutAnimation, ErDiagrams,
  Ej1Serialization, DiagramCollaboration, ImportAndExportVisio
} from '@syncfusion/ej2-diagrams';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';
import { moveIdToHost, assignEventPlaceholders } from './diagramHelpers';

@generateBindables("diagram")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-diagram')
export class Ej2Diagram extends SyncfusionWrapper<Diagram, DiagramModel> {
  protected syncfusionWidgetType = Diagram;

  protected onBeforeWidgetInstantiation() {
    // Diagram.Inject is global and the diagram only activates a module when its options ask for it (layout.type,
    // snapSettings.constraints, constraints & UndoRedo, contextMenuSettings.show, dataSourceSettings, ...). Those
    // options can be changed after creation, so bring every module that does not need a license or a service.
    Diagram.Inject(
      UndoRedo, DiagramContextMenu, Snapping, PrintAndExport, BpmnDiagrams, ConnectorBridging, ConnectorEditing,
      DataBinding, HierarchicalTree, MindMap, RadialTree, ComplexHierarchicalTree, SymmetricLayout, FlowchartLayout,
      LineRouting, AvoidLineOverlapping, LineDistribution, LayoutAnimation, ErDiagrams, Ej1Serialization,
      DiagramCollaboration, ImportAndExportVisio
    );
  }

  protected appendWidget() {
    moveIdToHost(this.element, this.widgetElement, 'diagram');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    assignEventPlaceholders(this.widget, this.getBindables().bindableEvents, constants.eventPrefix);
  }

  protected onWidgetCreated() {
  }

  /**
   * The diagram applies scrollSettings offsets after render but ignores a changed `currentZoom`, the documented way
   * to zoom at run time is zoom()/zoomTo(). Honour the bound zoom value.
   */
  protected scrollSettingsChanged(newValue: any) {
    const widget: any = this.widget;
    const value = this[`${constants.bindablePrefix}scrollSettings`] || newValue;
    widget.scrollSettings = value;
    if (value && typeof value.currentZoom === 'number' && widget.scroller && widget.scroller.currentZoom &&
      Math.abs(widget.scroller.currentZoom - value.currentZoom) > 1e-6) {
      widget.zoom(value.currentZoom / widget.scroller.currentZoom);
    }
  }
}
