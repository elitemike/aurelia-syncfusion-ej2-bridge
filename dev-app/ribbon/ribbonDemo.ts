import { Ej2Ribbon } from 'widgets/ribbon/ej2-ribbon';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2Ribbon)
export class RibbonDemo {
  // default (classic layout)
  tabs = this.makeTabs('d');
  selectedTab = 0;
  minimized = false;
  selectingCount = 0;
  selectedCount = 0;
  lastSelecting = -1;
  expandingCount = 0;
  collapsingCount = 0;
  createdCount = 0;
  pasteClicks = 0;
  boldChanges = 0;
  boldChecked = false;
  fontSize = '';

  // simplified layout
  simplifiedTabs = this.makeTabs('s');
  layout = 'Simplified';
  hideSwitcher = false;
  simplifiedWidth = '300px';
  layoutSwitchedCount = 0;
  lastLayout = '';
  overflowOpenCount = 0;
  overflowCloseCount = 0;

  // file menu and backstage
  fileTabs = this.makeTabs('f');
  fileMenu: any = {
    visible: true,
    text: 'File',
    menuItems: [{ text: 'New' }, { text: 'Open' }, { separator: true }, { text: 'Save' }],
    select: (args) => { this.fileSelected = args.item.text; }
  };
  fileSelected = '';
  backstageTabs = this.makeTabs('b');
  backStageMenu: any = {
    visible: true,
    text: 'Backstage',
    items: [
      { id: 'bs-info', text: 'Info', content: '<div class="rb-info">Document info</div>' },
      { id: 'bs-print', text: 'Print', content: '<div class="rb-print">Print settings</div>' }
    ]
  };

  // contextual tabs
  contextTabs = this.makeTabs('c');
  contextualTabs: any[] = [{
    visible: true,
    isSelected: false,
    tabs: [{
      id: 'cx-picture',
      header: 'Picture Format',
      groups: [{ id: 'cx-picture-g', header: 'Adjust', collections: [{ id: 'cx-picture-c', items: [{ id: 'cx-picture-i', type: 'Button', buttonSettings: { content: 'Crop' } }] }] }]
    }]
  }];

  // key tips
  keyTabs = this.makeTabs('k', true);
  enableKeyTips = true;

  // launcher icon
  launcherTabs = this.makeTabs('l');
  launcherIconCss = 'e-icons e-save';
  launcherCount = 0;

  // help pane, css, animation, width
  miscTabs = this.makeTabs('m');
  helpPaneTemplate = '<div class="rb-help">Need help?</div>';
  cssClass = 'rb-one';
  tabAnimation: any = { previous: { effect: 'None', duration: 0 }, next: { effect: 'None', duration: 0 } };
  width = '700px';

  makeTabs(prefix: string, keyTips = false): any[] {
    const tip = (t: string) => (keyTips ? { keyTip: t } : {});
    return [
      {
        id: `${prefix}-home`,
        header: 'Home',
        ...tip('H'),
        groups: [
          {
            id: `${prefix}-clipboard`,
            header: 'Clipboard',
            showLauncherIcon: true,
            collections: [
              {
                id: `${prefix}-clip-c1`,
                items: [{
                  id: `${prefix}-paste`, type: 'Button', allowedSizes: 4,
                  buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: () => { this.pasteClicks++; } },
                  ...tip('V')
                }]
              },
              {
                id: `${prefix}-clip-c2`,
                items: [
                  { id: `${prefix}-cut`, type: 'Button', allowedSizes: 2, buttonSettings: { content: 'Cut', iconCss: 'e-icons e-cut' } },
                  { id: `${prefix}-copy`, type: 'Button', allowedSizes: 2, buttonSettings: { content: 'Copy', iconCss: 'e-icons e-copy' } }
                ]
              }
            ]
          },
          {
            id: `${prefix}-font`,
            header: 'Font',
            collections: [{
              id: `${prefix}-font-c1`,
              items: [
                {
                  id: `${prefix}-size`, type: 'ComboBox', allowedSizes: 2,
                  comboBoxSettings: { dataSource: ['10', '12', '14', '18'], index: 1, width: '70px', change: (args) => { this.fontSize = args.value; } }
                },
                {
                  id: `${prefix}-bold`, type: 'CheckBox', allowedSizes: 2,
                  checkBoxSettings: { label: 'Bold', checked: false, change: (args) => { this.boldChanges++; this.boldChecked = args.checked; } }
                }
              ]
            }]
          }
        ]
      },
      {
        id: `${prefix}-insert`,
        header: 'Insert',
        groups: [{
          id: `${prefix}-tables`,
          header: 'Tables',
          collections: [{
            id: `${prefix}-tables-c1`,
            items: [
              { id: `${prefix}-table`, type: 'Button', allowedSizes: 4, buttonSettings: { content: 'Table', iconCss: 'e-icons e-table' } },
              {
                id: `${prefix}-shapes`, type: 'DropDown', allowedSizes: 4,
                dropDownSettings: { content: 'Shapes', iconCss: 'e-icons e-shapes', items: [{ text: 'Square' }, { text: 'Circle' }] }
              },
              {
                id: `${prefix}-split`, type: 'SplitButton', allowedSizes: 4,
                splitButtonSettings: { content: 'Chart', iconCss: 'e-icons e-chart', items: [{ text: 'Bar' }, { text: 'Line' }] }
              }
            ]
          }]
        }]
      },
      {
        id: `${prefix}-view`,
        header: 'View',
        groups: [{
          id: `${prefix}-zoom`,
          header: 'Zoom',
          collections: [{
            id: `${prefix}-zoom-c1`,
            items: [
              { id: `${prefix}-color`, type: 'ColorPicker', allowedSizes: 2, colorPickerSettings: { value: '#ff0000' } },
              {
                id: `${prefix}-align`, type: 'GroupButton', allowedSizes: 4,
                groupButtonSettings: { items: [{ content: 'Left', iconCss: 'e-icons e-align-left' }, { content: 'Center', iconCss: 'e-icons e-align-center' }, { content: 'Right', iconCss: 'e-icons e-align-right' }] }
              }
            ]
          }]
        }]
      }
    ];
  }

  onTabSelecting(event: CustomEvent) {
    this.selectingCount++;
    this.lastSelecting = event.detail.selectedIndex;
  }

  onTabSelected() { this.selectedCount++; }
  onExpanding() { this.expandingCount++; }
  onCollapsing() { this.collapsingCount++; }
  onCreated() { this.createdCount++; }
  onLayoutSwitched(event: CustomEvent) { this.layoutSwitchedCount++; this.lastLayout = event.detail.activeLayout; }
  onOverflowOpen() { this.overflowOpenCount++; }
  onOverflowClose() { this.overflowCloseCount++; }
  onLauncherClick() { this.launcherCount++; }

  goTo(index: number) { this.selectedTab = index; }
  minimize() { this.minimized = true; }
  classic() { this.layout = 'Classic'; }
  hide() { this.hideSwitcher = true; }
  restyle() { this.cssClass = 'rb-two'; }
  resize() { this.width = '520px'; }
  noKeyTips() { this.enableKeyTips = false; }
  showContextual() { this.contextualTabs = [{ ...this.contextualTabs[0], isSelected: true }]; }
}
