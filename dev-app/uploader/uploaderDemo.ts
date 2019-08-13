import { UploaderModel } from "@syncfusion/ej2-inputs";
import * as uid from "uuid/v4";
import { Ej2UploaderDataAdapter } from "controls/uploader/ej2-uploader";
import { HttpClient, json } from "aurelia-fetch-client";
import { autoinject } from "aurelia-framework";
@autoinject

export class UploaderDemo {

  constructor(private httpClient: HttpClient) {

  }

  uploaderModel: UploaderModel = {
    asyncSettings: {
      saveUrl: "http://localhost:5000/api/file/upload/test",
      removeUrl: "http://localhost:5000/api/file/RemoveWithMetaData/test"
    },
    multiple: true
  }


  files = [{
    id: "ABB",
    name: "test",
    type: "xml",
    size: "500"
  }];

  metadata = {
    name: "Joe Smith",
    age: 50
  };

  uploadResultModel = {
    id: "id",
    fileContextId: "fileContextId",
    sha256: "sha256",
  };

  dataAdapter: Ej2UploaderDataAdapter = {
    remove: async (file: any) => {
      await this.httpClient.fetch(this.uploaderModel.asyncSettings.removeUrl + "/" + file.id, { method: "post", body: json(this.metadata) })
        .catch((e) => {
          throw "File could not be delete"
        })
        .then((response: Response) => {
          if (!response.ok) {
            throw "File could not be delete"
          }
        });
    }
  }

  onSuccess(args: any) {
    console.log("success args", args);
  }


  generateMetaData(file) {
    let metadata: any = {};

    metadata.fileContextId = uid();

    return metadata;
  }
}
