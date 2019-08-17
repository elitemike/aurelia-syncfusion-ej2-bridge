import * as uid from "uuid/v4";
import { RemovingEventArgs } from "@syncfusion/ej2-inputs";
export class UploaderFunctions {

  constructor(private context: any) {

  }

  private name = "Uploader Functions";

  onSuccess(args: any) {
    // console.log(`${this.name} -success args`, args);
  }

  onUploading(args: any) {
    //  console.log("uploading args", args);
  }


  generateMetaData(file) {
    let metadata: any = {};

    metadata.fileContextId = uid();

    return metadata;
  }

  onRemoving(args: RemovingEventArgs) {
    // args.cancel = true;
  }
}
