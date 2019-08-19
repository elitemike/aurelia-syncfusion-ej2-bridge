import { Ej2UploaderDataAdapter } from '../widgets/uploader/ej2-uploader';

export interface IEj2Uplaoder extends IEJWidget {
  mapAdditionalFilePropertiesToFiles: boolean;
  sendAdditionalFilePropertiesAsFormData: boolean;

  metadata: any;
  formDataProperty;
  metadataGenerator: (file: object) => object;
  uploadResultModel: object;
  dataAdapter: Ej2UploaderDataAdapter;
  autoRemoveServerFiles;
  context: any;
  serverDelete: boolean;
  removeFile(file): void;
  removeAll(): void;
}

export interface IEJWidget {
  refresh(): void;
  recreate(): void;
  dataBind(): void;
}
