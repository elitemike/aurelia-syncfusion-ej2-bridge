import { FileManagerModel } from '@syncfusion/ej2-filemanager';
export class FileManagerDemo {

  model: FileManagerModel = null;

  /**
   *
   */
  constructor() {
    let hostUrl: string = 'https://ej2-azure-aspcore-service.azurewebsites.net/';
    this.model = {
      ajaxSettings: {
        url: hostUrl + 'api/AzureFileManager/AzureFileOperations',
        getImageUrl: hostUrl + 'api/AzureFileManager/AzureGetImage',
        uploadUrl: hostUrl + 'api/AzureFileManager/AzureUpload',
        downloadUrl: hostUrl + 'api/AzureFileManager/AzureDownload'
      },
      view: 'Details'
    };

  }
}
