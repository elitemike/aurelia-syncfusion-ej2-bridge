import { constants } from 'common/constants';
import { Uploader, UploaderModel, UploadingEventArgs } from "@syncfusion/ej2-inputs";
import { SyncfusionWrapper } from "common/syncfusionWrapper";
import { generateBindables } from "utilities/decorator";
import { bindable } from 'aurelia-framework';

@generateBindables("uploader")
export class Ej2Uploader extends SyncfusionWrapper<Uploader, UploaderModel> {
  protected syncfusionWidgetType = Uploader;
  public mapAdditionalFilePropertiesToFiles: boolean = true;
  public sendAdditionalFilePropertiesAsFormData: boolean = true;

  @bindable
  public metadata: any = null;
  @bindable
  public formDataProperty = "metadata";
  @bindable
  public onUploading: (args: UploadingEventArgs) => void;
  @bindable
  onSuccess: (args: any, context: any) => void;
  @bindable
  public metadataGenerator: (file: object) => object = null;
  @bindable
  public uploadResultModel: object = null;


  protected onCreated() {
    if (this.mapAdditionalFilePropertiesToFiles && this.widget.files) {
      let filesPropertyName = `${constants.bindablePrefix}files`;

      let extraProperties = this.getAdditionalFileProperties();
      if (extraProperties.length > 0) {
        for (let i = 0; i < this.widget.files.length; i++) {
          const file = this.widget.files[i];

          extraProperties.forEach((prop) => {
            file[prop] = this[filesPropertyName][i][prop];
          });
        }
      }
    }

    this.widget.uploading = (args) => { this.onFileUpload(args); };
    this.widget.success = (args: any) => { this.success(args); };
  }

  success(args: any): void {
    if (args.operation === "upload") {
      let response = JSON.parse(args.e.target.response);
      let filesPropertyName = `${constants.bindablePrefix}files`;
      let _uploadedFile = args.file;
      let fileName = (<string>_uploadedFile.name).substr(0, _uploadedFile.name.length - (_uploadedFile.type.length + 1));

      // map response values
      let additionalProperties = {};
      if (this.uploadResultModel) {
        for (let prop in this.uploadResultModel) {
          additionalProperties[this.uploadResultModel[prop]] = response[prop];
        }
      }

      let file = {
        name: fileName,
        size: _uploadedFile.size,
        type: `.${_uploadedFile.type}`
      };

      Object.assign(_uploadedFile, additionalProperties);
      Object.assign(file, additionalProperties);

      if (this[filesPropertyName] === null) {
        this[filesPropertyName] = [];
      }

      this[filesPropertyName].push(file);

      if (this.onSuccess !== undefined && typeof this.onSuccess === "function") {
        this.onSuccess.call(this, args);
      }
    }
    else {
      this.info("something else happened")
    }
  }

  private getAdditionalFileProperties() {
    let extraProperties: string[] = [];

    let filesPropertyName = `${constants.bindablePrefix}files`;
    if (this[filesPropertyName] && this[filesPropertyName].length > 0) {
      for (let prop in this[filesPropertyName][0]) {
        if (prop !== "name" && prop !== "size" && prop !== "type") {
          extraProperties.push(prop);
        }
      }
    }

    return extraProperties;
  }

  private onFileUpload(args: UploadingEventArgs) {
    let _metadata = this.createMetadata(args.fileData);

    if (_metadata) {
      if (this.formDataProperty) {
        let formData = {};
        formData[this.formDataProperty] = JSON.stringify(_metadata);
        args.customFormData = [formData];
      } else {
        let formData = [];
        for (let prop in _metadata) {
          let kvp = {};
          kvp[prop] = _metadata[prop];
          formData.push(kvp);
        }
        args.customFormData = formData;
      }
    }

    if (this.onUploading !== undefined && typeof this.onUploading === "function") {
      this.onUploading(args);
    }
  }

  private createMetadata(file) {
    let _metadata = null;

    if (this.sendAdditionalFilePropertiesAsFormData) {
      if (_metadata === null) {
        _metadata = {};
      }

      let props = this.getAdditionalFileProperties();

      props.forEach((prop) => {
        _metadata[prop] = file[prop];
      });
    }

    if (this.metadata !== null) {
      if (_metadata === null) {
        _metadata = {};
      }

      Object.assign(_metadata, this.metadata);
    }

    if (this.metadataGenerator) {
      if (_metadata === null) {
        _metadata = {};
      }
      let _generatedMetadata = this.metadataGenerator.call(this, file);
      Object.assign(_metadata, _generatedMetadata);
    }

    return _metadata;
  }
}



export interface Ej2UploaderDataAdapter {
  removeUploadedFile(file, eventArgs, removeDirectly, custom): Promise<void>;
}

export interface Ej2UploaderRemove {

}
