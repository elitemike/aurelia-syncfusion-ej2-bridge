import { Ej2Maps } from 'widgets/maps/ej2-maps';
import { viewResources } from 'aurelia-framework';
// A tiny local world: six rectangular "countries" in longitude/latitude, so the demo never needs a network request.
const rectangle = (name: string, lon1: number, lon2: number, lat1: number, lat2: number) => ({
  type: 'Feature',
  properties: { name, continent: lon1 < -60 ? 'West' : 'East' },
  geometry: { type: 'Polygon', coordinates: [[[lon1, lat1], [lon2, lat1], [lon2, lat2], [lon1, lat2], [lon1, lat1]]] }
});

const world = {
  type: 'FeatureCollection',
  features: [
    rectangle('Alpha', -120, -80, 35, 60),
    rectangle('Beta', -75, -35, 35, 60),
    rectangle('Gamma', -120, -80, 0, 30),
    rectangle('Delta', -75, -35, 0, 30),
    rectangle('Epsilon', -20, 20, 35, 60),
    rectangle('Zeta', -20, 20, 0, 30)
  ]
};

const regions = [
  { name: 'Alpha', category: 'High', population: 1234567 },
  { name: 'Beta', category: 'Low', population: 456789 },
  { name: 'Gamma', category: 'High', population: 987654 },
  { name: 'Delta', category: 'Low', population: 123456 },
  { name: 'Epsilon', category: 'Low', population: 765432 },
  { name: 'Zeta', category: 'High', population: 345678 }
];

const cities = [
  { name: 'Alpha City', latitude: 47, longitude: -100 },
  { name: 'Beta Town', latitude: 47, longitude: -55 },
  { name: 'Zeta Port', latitude: 15, longitude: 0 }
];

// four markers close together get merged into one cluster
const clustered = [
  { name: 'C1', latitude: 45, longitude: -100 },
  { name: 'C2', latitude: 45.2, longitude: -99.8 },
  { name: 'C3', latitude: 44.8, longitude: -100.2 },
  { name: 'C4', latitude: 45.1, longitude: -100.1 },
  { name: 'Lonely', latitude: 15, longitude: 0 }
];

const baseLayer = (extra: any = {}) => ({ shapeData: world, animationDuration: 0, shapeSettings: { fill: '#c5e1a5', border: { color: '#33691e', width: 1 } }, ...extra });

@viewResources(Ej2Maps)
export class MapsDemo {
  // basic
  titleSettings = { text: 'Tiny world', textStyle: { size: '16px', color: '#b71c1c', fontWeight: 'bold' }, subtitleSettings: { text: 'six countries' } };
  mapsArea = { background: '#e3f2fd', border: { color: '#1565c0', width: 1 } };
  border = { color: '#6a1b9a', width: 2 };
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  centerPosition = { latitude: 30, longitude: -50 };
  basicLayers = [baseLayer({
    dataSource: regions, shapeDataPath: 'name', shapePropertyPath: 'name',
    tooltipSettings: { visible: true, valuePath: 'population', format: '${name}: ${population}' }
  })];

  // colour mapping and legend
  legendLayers = [baseLayer({
    dataSource: regions, shapeDataPath: 'name', shapePropertyPath: 'name',
    shapeSettings: {
      colorValuePath: 'category', fill: '#cccccc', border: { color: '#ffffff', width: 1 },
      colorMapping: [{ value: 'High', color: '#e53935', label: 'High density' }, { value: 'Low', color: '#43a047', label: 'Low density' }]
    },
    toggleLegendSettings: { enable: true, applyShapeSettings: false, fill: '#bdbdbd', opacity: 0.6 }
  })];
  legend = {
    visible: true, position: 'Bottom', alignment: 'Center', type: 'Layers', mode: 'Default', shape: 'Rectangle', background: '#fafafa',
    border: { color: '#9e9e9e', width: 1 }, title: { text: 'Density' }, toggleVisibility: true, textStyle: { size: '12px' }
  };

  // data labels and bubbles
  bubbleLayers = [baseLayer({
    dataSource: regions, shapeDataPath: 'name', shapePropertyPath: 'name', animationDuration: 200,
    dataLabelSettings: { visible: true, labelPath: 'name', smartLabelMode: 'None', textStyle: { color: '#1b5e20', size: '12px' }, animationDuration: 0 },
    bubbleSettings: [{
      visible: true, dataSource: regions, valuePath: 'population', colorValuePath: 'category', minRadius: 6, maxRadius: 24, opacity: 0.8,
      bubbleType: 'Circle', animationDuration: 200, colorMapping: [{ value: 'High', color: '#e53935' }, { value: 'Low', color: '#1e88e5' }],
      tooltipSettings: { visible: true, valuePath: 'population', format: '${name}: ${population}' }
    }]
  })];

  // the bubble animation reads the zoom module, which only exists while zooming is enabled
  bubbleZoom = { enable: true, mouseWheelZoom: false, enablePanning: false, toolbarSettings: { buttonSettings: { toolbarItems: ['ZoomIn'] } } };

  // markers
  markerLayers = [baseLayer({
    markerSettings: [{
      visible: true, shape: 'Circle', height: 16, width: 16, fill: '#d81b60', border: { color: '#ffffff', width: 2 }, dataSource: cities,
      latitudeValuePath: 'latitude', longitudeValuePath: 'longitude', enableDrag: true, animationDuration: 0,
      tooltipSettings: { visible: true, valuePath: 'name' }
    }]
  })];
  templateLayers = [baseLayer({
    markerSettings: [{ visible: true, dataSource: cities, latitudeValuePath: 'latitude', longitudeValuePath: 'longitude', template: '<div class="mp-pin" style="font-weight:bold">${name}</div>', animationDuration: 0 }]
  })];
  clusterLayers = [baseLayer({
    markerSettings: [{
      visible: true, shape: 'Circle', height: 12, width: 12, fill: '#00897b', dataSource: clustered, latitudeValuePath: 'latitude', longitudeValuePath: 'longitude', animationDuration: 0,
      clusterSettings: { allowClustering: true, shape: 'Circle', width: 28, height: 28, fill: '#6a1b9a', labelStyle: { color: '#ffffff', size: '12px' }, border: { color: '#ffffff', width: 1 } }
    }]
  })];

  // zoom
  zoomLayers = [baseLayer()];
  zoomSettings = {
    enable: true, mouseWheelZoom: true, doubleClickZoom: true, pinchZooming: true, zoomOnClick: false, enablePanning: true, enableSelectionZooming: true,
    minZoom: 1, maxZoom: 10, zoomFactor: 1, toolbarSettings: { horizontalAlignment: 'Far', verticalAlignment: 'Near', orientation: 'Horizontal', buttonSettings: { toolbarItems: ['ZoomIn', 'ZoomOut', 'Reset'] } }
  };

  // selection, highlight, tooltip
  interactionLayers = [baseLayer({
    dataSource: regions, shapeDataPath: 'name', shapePropertyPath: 'name',
    selectionSettings: { enable: true, fill: '#80cbc4', opacity: 1, enableMultiSelect: false, border: { color: '#00695c', width: 2 } },
    highlightSettings: { enable: true, fill: '#ffd54f', opacity: 1, border: { color: '#ff6f00', width: 2 } },
    tooltipSettings: { visible: true, valuePath: 'name' },
    markerSettings: [{
      visible: true, shape: 'Diamond', height: 14, width: 14, fill: '#3949ab', dataSource: cities, latitudeValuePath: 'latitude', longitudeValuePath: 'longitude', animationDuration: 0,
      selectionSettings: { enable: true, fill: '#ff5722' }, highlightSettings: { enable: true, fill: '#ffeb3b' }, tooltipSettings: { visible: true, valuePath: 'name' }
    }]
  })];

  // annotations
  annotations = [{ content: '<div class="mp-annotation" style="font-weight:bold">Look here</div>', x: '50%', y: '90%', horizontalAlignment: 'Center', verticalAlignment: 'Near', zIndex: '1' }];
  annotationLayers = [baseLayer()];

  // navigation lines and polygons
  lineLayers = [baseLayer({
    navigationLineSettings: [{ visible: true, latitude: [47, 15], longitude: [-100, 0], color: '#d84315', width: 3, angle: 0.2, dashArray: '5,3', arrowSettings: { showArrow: true, size: 10, color: '#d84315', position: 'End' } }],
    polygonSettings: {
      polygons: [{ points: [{ latitude: 10, longitude: -110 }, { latitude: 25, longitude: -110 }, { latitude: 25, longitude: -90 }, { latitude: 10, longitude: -90 }], fill: '#ab47bc', opacity: 0.6, borderColor: '#4a148c', borderWidth: 2 }]
    }
  })];

  // lifecycle
  lifecycleLayers = [baseLayer()];

  // dynamic
  dynWidth = '420';
  dynTitle = { text: 'First title' };
  dynBackground = '#ffffff';
  dynTheme = 'Material3';
  dynProjection = 'Mercator';
  dynLayers = [baseLayer({ shapeSettings: { fill: '#c5e1a5', border: { color: '#33691e', width: 1 } } })];

  counts: { [name: string]: number } = {
    load: 0, loaded: 0, beforePrint: 0, click: 0, onclick: 0, doubleClick: 0, rightClick: 0, resize: 0, tooltipRender: 0, legendRendering: 0, tooltipRenderComplete: 0,
    shapeSelected: 0, itemSelection: 0, itemHighlight: 0, shapeHighlight: 0, layerRendering: 0, shapeRendering: 0, markerRendering: 0, markerClusterRendering: 0,
    markerClick: 0, markerDragStart: 0, markerDragEnd: 0, markerClusterClick: 0, markerClusterMouseMove: 0, markerMouseMove: 0, mouseMove: 0, dataLabelRendering: 0,
    bubbleRendering: 0, bubbleClick: 0, bubbleMouseMove: 0, animationComplete: 0, annotationRendering: 0, zoom: 0, pan: 0, panComplete: 0, zoomComplete: 0
  };
  last: { [name: string]: string } = { shapeSelected: '', tooltipRender: '', markerClick: '', bubbleClick: '', markerDragEnd: '', click: '', legendRendering: '' };

  log(name: string, event: CustomEvent) {
    this.counts[name]++;
    const args = event.detail || {};
    switch (name) {
      case 'shapeSelected':
        this.last.shapeSelected = args.shapeData && args.shapeData.name || (args.data && args.data.name) || 'selected';
        break;
      case 'tooltipRender':
        this.last.tooltipRender = args.content || '';
        break;
      case 'markerClick':
        this.last.markerClick = args.data && args.data.name || 'marker';
        break;
      case 'bubbleClick':
        this.last.bubbleClick = args.data && args.data.name || 'bubble';
        break;
      case 'markerDragEnd':
        this.last.markerDragEnd = args.latitude !== undefined ? `${args.latitude}` : 'dragged';
        break;
      case 'click':
        this.last.click = args.latitude !== undefined ? 'with coordinates' : 'clicked';
        break;
      case 'legendRendering':
        this.last.legendRendering = args.text || '';
        break;
      default:
        break;
    }
  }

  onBeforePrint(event: CustomEvent) {
    this.counts.beforePrint++;
    // do not open a print window in the demo
    event.detail.cancel = true;
  }

  change() {
    this.dynWidth = '520';
    this.dynTitle = { text: 'Second title' };
    this.dynBackground = '#ffe0b2';
    this.dynTheme = 'Bootstrap5Dark';
    this.dynProjection = 'Miller';
    this.dynLayers = [baseLayer({ shapeSettings: { fill: '#ffab91', border: { color: '#bf360c', width: 1 } } })];
  }
}
