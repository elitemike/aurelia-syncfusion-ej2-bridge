import { Ej2UploaderDataAdapter } from '../widgets/uploader/ej2-uploader';
import { Uploader } from '@syncfusion/ej2-inputs';
import { IEJ2WidgetBridge } from './IEJ2WidgetBridge';

export interface IEj2Uplaoder extends IEJ2WidgetBridge<Uploader> {
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


