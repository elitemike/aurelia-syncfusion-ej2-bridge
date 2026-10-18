import { UploaderModel, RemovingEventArgs } from '@syncfusion/ej2-inputs';
import { Ej2UploaderDataAdapter } from 'widgets/uploader/ej2-uploader';
import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { v4 as uuid } from 'uuid';

// These endpoints need a backend, the e2e tests stub them with page.route.
const saveUrl = '/api/file/upload/test';
const removeUrl = '/api/file/remove/test';

@autoinject
export class UploaderDemo {
  files: any[] = [];
  existing: any[] = [{ name: 'existing', size: 3500, type: '.txt', id: 'file-1' }];
  eventFiles: any[] = [];
  uploadedEvents = 0;
  removedEvents = 0;
  removingEvents = 0;

  multipleModel: UploaderModel = { asyncSettings: { saveUrl, removeUrl }, multiple: true };
  singleModel: UploaderModel = { asyncSettings: { saveUrl, removeUrl }, multiple: false };
  restrictedModel: UploaderModel = { asyncSettings: { saveUrl, removeUrl }, allowedExtensions: '.txt', maxFileSize: 1000 };

  metadata = { name: 'Joe Smith' };
  uploadResultModel = { id: 'id', fileContextId: 'fileContextId', sha256: 'sha256' };

  dataAdapter: Ej2UploaderDataAdapter = {
    remove: async (file: any) => {
      const response = await this.httpClient.fetch(`${removeUrl}/${file.id}`, { method: 'post', body: json(this.metadata) });
      if (!response.ok) {
        throw 'File could not be deleted';
      }
    }
  };

  constructor(private httpClient: HttpClient) { }

  generateMetaData(file) {
    return { fileContextId: uuid() };
  }

  onRemoving(args: CustomEvent<RemovingEventArgs>) {
    this.removingEvents++;
  }

  onUploaded(args: CustomEvent) {
    this.uploadedEvents++;
    this.eventFiles.push(args.detail.uploadedFile);
  }

  onRemoved(args: CustomEvent) {
    this.removedEvents++;
    this.eventFiles.splice(this.eventFiles.findIndex((x) => x.__id === args.detail.removedFile.__id), 1);
  }
}
