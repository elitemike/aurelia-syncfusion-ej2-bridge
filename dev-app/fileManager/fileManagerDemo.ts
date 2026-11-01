import { FileManagerModel } from '@syncfusion/ej2-filemanager';
import { Ej2FileManager } from 'widgets/fileManager/ej2-fileManager';
import { viewResources } from 'aurelia-framework';

// Syncfusion's hosted sample service, the e2e tests replace it with a stub.
const hostUrl = 'https://ej2-azure-aspcore-service.azurewebsites.net/';

// 1x1 png, used as the thumbnail of the local image file
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const item = (id: string, name: string, isFile: boolean, parentId: string, filterPath: string, extra: any = {}) => ({
  id, name, isFile, parentId, filterPath, hasChild: false, size: isFile ? 1000 : 0, type: isFile ? '.txt' : '',
  dateModified: new Date('2024-01-01T00:00:00Z'), dateCreated: new Date('2024-01-01T00:00:00Z'), ...extra
});

/** A fresh copy of the in-memory file system, each file manager mutates its own copy. */
export function createFileSystem() {
  return [
    item('0', 'Files', false, null, '', { hasChild: true }),
    item('1', 'Documents', false, '0', '\\', { hasChild: true }),
    item('2', 'Pictures', false, '0', '\\'),
    item('3', 'readme.txt', true, '0', '\\', { size: 1024 }),
    item('4', 'notes.md', true, '0', '\\', { size: 300, type: '.md' }),
    item('5', 'big.log', true, '0', '\\', { size: 9000, type: '.log' }),
    item('6', 'photo.png', true, '0', '\\', { size: 500, type: '.png', imageUrl: pixel }),
    item('7', 'work.docx', true, '1', '\\Documents\\', { size: 2000, type: '.docx' })
  ];
}

@viewResources(Ej2FileManager)
export class FileManagerDemo {
  model: FileManagerModel = {
    ajaxSettings: {
      url: hostUrl + 'api/AzureFileManager/AzureFileOperations',
      getImageUrl: hostUrl + 'api/AzureFileManager/AzureGetImage',
      uploadUrl: hostUrl + 'api/AzureFileManager/AzureUpload',
      downloadUrl: hostUrl + 'api/AzureFileManager/AzureDownload'
    }
  };
  view = 'Details';
  opened = 0;
  lastOpened = '';

  // every raised event is counted per file manager
  counts: { [name: string]: number } = {};
  logText = '';
  localCounts: { [name: string]: number } = {};
  localLogText = '';
  lifeCounts: { [name: string]: number } = {};
  lifeLogText = '';

  localData = createFileSystem();
  propsData = createFileSystem();
  iconsData = createFileSystem();
  lifeData = createFileSystem();
  mcpData = createFileSystem();
  showTemp = true;

  // appearance section
  path = '/';
  selected: string[] = ['3']; // in fileSystemData mode items are selected by id
  sortOrder = 'Descending';
  showHidden = false;
  popupTarget = '#fm-popup-target';
  detailsViewSettings = {
    columns: [
      { field: 'name', headerText: 'Title', minWidth: 120, width: 'auto', customAttributes: { class: 'e-fe-grid-name' }, template: '<span class="e-fe-text">${name}</span>' },
      { field: 'size', headerText: 'Bytes', minWidth: 50, width: '110', template: '<span class="e-fe-size">${size}</span>' }
    ]
  };
  navigationPaneTemplate = '<span class="np-tpl">nav-${name}</span>';

  // large icons section
  largeIconsTemplate = '<div class="li-tpl">icon-${name}</div>';
  contextMenuSettings = { file: ['Open', '|', 'Details'], folder: ['Open'], layout: ['Refresh'], visible: true };
  searchSettings = { allowSearchOnTyping: false, filterType: 'startsWith', ignoreCase: true };
  toolbarItems = [{ name: 'NewFolder' }, { name: 'Refresh' }, { name: 'Custom', text: 'Custom action', tooltipText: 'custom item' }];
  sortComparer = (a: string, b: string) => b.localeCompare(a);
  webMcpSettings = { name: 'demo-fm' };

  // upload section (mocked service)
  uploadSettings = { autoUpload: false, minFileSize: 2, maxFileSize: 100000 };

  log(name: string, event?: CustomEvent) {
    this.counts[name] = (this.counts[name] || 0) + 1;
    this.counts = Object.assign({}, this.counts);
    this.logText = Object.keys(this.counts).map(k => `${k}:${this.counts[k]}`).join(' ');
  }

  llog(name: string) {
    this.localCounts[name] = (this.localCounts[name] || 0) + 1;
    this.localLogText = Object.keys(this.localCounts).map(k => `${k}:${this.localCounts[k]}`).join(' ');
  }

  lifeLog(name: string) {
    this.lifeCounts[name] = (this.lifeCounts[name] || 0) + 1;
    this.lifeLogText = Object.keys(this.lifeCounts).map(k => `${k}:${this.lifeCounts[k]}`).join(' ');
  }

  onBeforeDownload(event: CustomEvent) {
    // the browser would navigate to the download service
    event.detail.cancel = true;
    this.log('beforeDownload');
  }

  onFileOpen(event: CustomEvent) {
    this.opened++;
    this.lastOpened = event.detail.fileDetails.name;
    this.log('fileOpen');
  }

  setView(view: string) {
    this.view = view;
  }
}
