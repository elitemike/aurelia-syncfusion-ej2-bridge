import { FileManagerModel } from '@syncfusion/ej2-filemanager';

// Syncfusion's hosted sample service, the e2e tests replace it with a stub.
const hostUrl = 'https://ej2-azure-aspcore-service.azurewebsites.net/';

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

  onFileOpen(event: CustomEvent) {
    this.opened++;
    this.lastOpened = event.detail.fileDetails.name;
  }

  setView(view: string) {
    this.view = view;
  }
}
