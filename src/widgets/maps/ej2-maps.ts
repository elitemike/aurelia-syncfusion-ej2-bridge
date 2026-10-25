import { Maps, MapsModel, Bubble, Highlight, Selection, Legend, Marker, MapsTooltip, Zoom, DataLabel, NavigationLine, Polygon, Annotations, Print, ImageExport, PdfExport } from '@syncfusion/ej2-maps';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';
import { ensureHostId, refreshOnPropertyChange } from '../visualizationHelpers';

@generateBindables("maps")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-maps')
export class Ej2Maps extends SyncfusionWrapper<Maps, MapsModel> {
  protected syncfusionWidgetType = Maps;

  protected onBeforeWidgetInstantiation() {
    // Maps.Inject registers modules globally. The map only activates a module when the options ask for it (bubbles,
    // highlight/selection, legend, markers, zoom, data labels, navigation lines, polygons, tooltips, annotations,
    // allowPrint, allowImageExport, allowPdfExport), but layers and settings can change after creation, so always
    // bring all of them.
    Maps.Inject(Bubble, Highlight, Selection, Legend, Marker, MapsTooltip, Zoom, DataLabel, NavigationLine, Polygon, Annotations, Print, ImageExport, PdfExport);
  }

  protected appendWidget() {
    ensureHostId(this.widgetElement, 'maps');
    super.appendWidget();
  }

  protected onWrapperCreated() {
    // Maps raises `onclick` instead of `click` as soon as the widget's `onclick` property is truthy, and never raises
    // both. Turn the flag on so `onclick` always fires, and relay it as `click` too so both bindings work.
    const widget: any = this.widget;
    widget.onclick = () => { };
    widget.addEventListener('onclick', (args: any) => {
      this.element.dispatchEvent(new CustomEvent(`${constants.eventPrefix}click`, { bubbles: true, detail: args }));
    });
    // the map has no `created` event and ignores every property but these after it rendered
    refreshOnPropertyChange(this, this.widget, [
      'background', 'height', 'width', 'layers', 'projectionType', 'centerPosition', 'legendSettings', 'baseLayerIndex', 'zoomSettings'
    ]);
  }

  protected onWidgetCreated() {
  }
}
