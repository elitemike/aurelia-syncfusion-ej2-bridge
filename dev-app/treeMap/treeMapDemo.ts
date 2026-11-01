import { DataManager, Query } from '@syncfusion/ej2-data';
import { Ej2TreeMap } from 'widgets/treeMap/ej2-treeMap';
import { viewResources } from 'aurelia-framework';

const countries = [
  { Continent: 'Asia', Country: 'China', Population: 1412, Density: 147, Color: '#c62828' },
  { Continent: 'Asia', Country: 'India', Population: 1408, Density: 428, Color: '#ef6c00' },
  { Continent: 'Asia', Country: 'Indonesia', Population: 275, Density: 151, Color: '#f9a825' },
  { Continent: 'Europe', Country: 'Russia', Population: 144, Density: 9, Color: '#2e7d32' },
  { Continent: 'Europe', Country: 'Germany', Population: 83, Density: 240, Color: '#00838f' },
  { Continent: 'Europe', Country: 'France', Population: 68, Density: 122, Color: '#1565c0' },
  { Continent: 'Africa', Country: 'Nigeria', Population: 218, Density: 226, Color: '#6a1b9a' },
  { Continent: 'Africa', Country: 'Ethiopia', Population: 123, Density: 115, Color: '#ad1457' },
  { Continent: 'Africa', Country: 'Egypt', Population: 109, Density: 109, Color: '#4e342e' }
];

@viewResources(Ej2TreeMap)
export class TreeMapDemo {
  countries = countries;

  titleSettings = { text: 'World population', textStyle: { size: '16px', color: '#b71c1c', fontWeight: 'bold' }, subtitleSettings: { text: 'millions', textStyle: { size: '12px' } } };
  border = { color: '#1565c0', width: 2 };
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  leaf = { labelPath: 'Country', showLabels: true, labelStyle: { size: '12px', color: '#ffffff' }, border: { color: '#ffffff', width: 1 }, gap: 0 };

  levels = [
    { groupPath: 'Continent', groupGap: 4, groupPadding: 6, showHeader: true, headerHeight: 22, headerFormat: '${Continent}', headerStyle: { color: '#212121', size: '13px' }, border: { color: '#9e9e9e', width: 1 } },
    { groupPath: 'Country', showHeader: false }
  ];
  palette = ['#3949ab', '#00897b', '#f4511e'];

  rangeLeaf = {
    labelPath: 'Country', showLabels: true, labelStyle: { size: '12px', color: '#ffffff' },
    colorMapping: [
      { from: 0, to: 100, color: '#43a047', label: 'Sparse' },
      { from: 101, to: 200, color: '#fb8c00', label: 'Medium' },
      { from: 201, to: 500, color: '#e53935', label: 'Dense' }
    ]
  };
  equalLeaf = {
    labelPath: 'Country', showLabels: true, labelStyle: { size: '12px', color: '#ffffff' },
    colorMapping: [
      { value: 'Asia', color: '#5e35b1' },
      { value: 'Europe', color: '#00acc1' },
      { value: 'Africa', color: '#fb8c00' }
    ]
  };
  templateLeaf = { labelPath: 'Country', labelTemplate: '<div class="tm-label" style="color:#fff;font-weight:bold">${Country}!</div>', templatePosition: 'Center', fill: '#37474f' };

  drillLevels = [
    { groupPath: 'Continent', groupGap: 4, groupPadding: 6, showHeader: true, headerHeight: 22, headerFormat: '${Continent}', border: { color: '#9e9e9e', width: 1 } },
    { groupPath: 'Country', showHeader: false }
  ];
  initialDrill = { groupIndex: 0, groupName: 'Asia' };

  legend = { visible: true, mode: 'Default', position: 'Bottom', shape: 'Rectangle', background: '#fafafa', textStyle: { size: '12px' }, border: { color: '#9e9e9e', width: 1 }, title: { text: 'Density' } };

  highlight = { enable: true, fill: '#ffd54f', opacity: '0.8', border: { color: '#ff6f00', width: 2 }, mode: 'Item' };
  selection = { enable: true, fill: '#80cbc4', opacity: '0.9', border: { color: '#00695c', width: 3 }, mode: 'Item' };
  tooltip = { visible: true, format: '${Country}: ${Population}M', fill: '#263238', textStyle: { color: '#ffffff' } };
  selectedText = '';
  tooltipText = '';

  dataManager = new DataManager(countries as any);
  query = new Query().where('Continent', 'equal', 'Europe', false);

  dynWidth = '420';
  dynData = countries.slice(0, 3);
  dynBackground = '#ffffff';
  dynTheme = 'Material3';
  dynLayout = 'Squarified';
  dynTitle = { text: 'First title' };

  counts: { [name: string]: number } = {
    drillStart: 0, drillEnd: 0, legendRendering: 0, legendItemRendering: 0, itemRendering: 0, itemSelected: 0, itemHighlight: 0, tooltipRendering: 0,
    itemClick: 0, itemMove: 0, click: 0, doubleClick: 0, rightClick: 0, mouseMove: 0, load: 0, loaded: 0, resize: 0, beforePrint: 0
  };

  log(name: string, event: CustomEvent) {
    this.counts[name]++;
    if (name === 'itemSelected') {
      this.selectedText = event.detail.items && event.detail.items[0] && event.detail.items[0].name;
    }
  }

  onTooltipRendering(event: CustomEvent) {
    this.counts.tooltipRendering++;
    this.tooltipText = event.detail.item && event.detail.item.name;
  }

  onBeforePrint(event: CustomEvent) {
    this.counts.beforePrint++;
    // do not open a print window in the demo
    event.detail.cancel = true;
  }

  change() {
    this.dynWidth = '540';
    this.dynData = countries.slice(3, 9);
    this.dynBackground = '#ffe0b2';
    this.dynTheme = 'Bootstrap5Dark';
    this.dynLayout = 'SliceAndDiceHorizontal';
    this.dynTitle = { text: 'Second title' };
  }
}
