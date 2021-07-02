import { UploaderModel, RemovingEventArgs } from "@syncfusion/ej2-inputs";
import { Ej2UploaderDataAdapter } from "widgets/uploader/ej2-uploader";
import { HttpClient, json } from "aurelia-fetch-client";
import { autoinject, observable, BindingEngine } from "aurelia-framework";
import { Ej2Uploader } from "index";
import { v4 as uuid } from "uuid";

@autoinject
export class UploaderDemo {
  files = [];
  files2 = [];
  widget: Ej2Uploader = null;
  widget2: Ej2Uploader = null;

  constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine) {

    // this.bindingEngine.collectionObserver(this.files).subscribe(() => {
    //   this.filesChanged();
    // });

    let _this = this;
    // setTimeout(() => {
    //   _this.files = [{
    //     "type": ".txt",
    //     "id": "file1",
    //     "size": 3500,
    //     "name": "File Text"
    //   }];
    //   //  this.widget.dataBind();

    //   this.bindingEngine.collectionObserver(this.files).subscribe(() => {
    //     this.filesChanged();
    //   });

    //   setTimeout(() => {
    //     _this.files = [{
    //       "type": ".txt",
    //       "id": "fileasdf1",
    //       "size": 3500,
    //       "name": "2nd Text"
    //     }];

    //     setTimeout(() => {
    //       _this.files.push({
    //         "type": ".txt",
    //         "id": "fileaseertdf1",
    //         "size": 3500,
    //         "name": "last Text"
    //       });
    //       console.log("file pushed")
    //     }, 3000);
    //   }, 3000);
    // }, 3000);

  }



  uploaderModel: UploaderModel = {
    asyncSettings: {
      saveUrl: "http://localhost:5000/api/file/upload/test",
      removeUrl: "http://localhost:5000/api/file/RemoveWithMetaData/test"
    },
    multiple: true
  }

  uploaderModel2: UploaderModel = {
    asyncSettings: {
      saveUrl: "http://localhost:5000/api/file/upload/test",
      removeUrl: "http://localhost:5000/api/file/RemoveWithMetaData/test"
    },
    multiple: false
  }


  metadata = {
    name: "Joe Smith",
    age: 50
  };

  metadata2 = {
    name: "Jane Doe",
    age: 62
  };

  uploadResultModel = {
    id: "id",
    fileContextId: "fileContextId",
    sha256: "sha256"
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

  filesChanged() {
    // console.log("files updated", this.files);

    // let _this = this;
    // setTimeout(() => {
    //   if (_this.files.length > 0) {
    //     _this.widget.removeFile(_this.files[0]);
    //     _this.widget.refresh();
    //   }
    // }, 5000);
  }

  onSuccess(args: any) {
    // console.log(`${this.name} -success args`, args);
  }

  onUploading(args: any) {
    //  console.log("uploading args", args);
  }


  generateMetaData(file) {
    let metadata: any = {};

    metadata.fileContextId = uuid();

    return metadata;
  }

  onRemoving(args: RemovingEventArgs) {
    // args.cancel = true;
  }
}
