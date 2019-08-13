import { UploaderModel } from "@syncfusion/ej2-inputs";
import * as uid from "uuid/v4";

export class UploaderDemo {

  uploaderModel: UploaderModel = {
    asyncSettings: {
      saveUrl: "http://localhost:5000/api/file/upload/test",
      removeUrl: "http://localhost:5000/api/file/RemoveWithMetaData/test"
    }
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
    sha256: "sha256"
  };

  onSuccess(args: any) {
    console.log("success args", args);
  }


  generateMetaData(file) {
    let metadata: any = {};

    metadata.fileContextId = uid();

    return metadata;
  }
}
