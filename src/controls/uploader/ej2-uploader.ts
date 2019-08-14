import { constants } from '../../common/constants';
import { Uploader, UploaderModel, UploadingEventArgs, RemovingEventArgs } from "@syncfusion/ej2-inputs";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { bindable } from 'aurelia-framework';
import { RemoveEventArgs } from '@syncfusion/ej2-navigations';
import * as uid from "uuid/v4";

@generateBindables("uploader")
export class Ej2Uploader extends SyncfusionWrapper<Uploader, UploaderModel> {
  private _filesProperty = `${constants.bindablePrefix}files`;
  private _privateIdProperty = "__id";
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
  public onSuccess: (args: any) => void;
  @bindable
  public onFailure: (args: any) => void;
  @bindable
  public onRemoving: (args: RemoveEventArgs) => void;
  @bindable
  public metadataGenerator: (file: object) => object = null;
  @bindable
  public uploadResultModel: object = null;
  @bindable
  public dataAdapter: Ej2UploaderDataAdapter = null;
  @bindable
  public autoRemoveServerFiles = true;


  protected onWrapperCreated() {
    this.widget.uploading = (args) => { this.onFileUpload(args); };
    this.widget.success = (args: any) => { this.success(args); };
    this.widget.failure = (args) => { this.failure(args); };
    this.widget.removing = (args) => { this.removing(args); };
    this.widget.change = (args) => { this.change(); };

    if (this.dataAdapter) {
      if (this.dataAdapter.remove) {
        let _this = this;
        // This is done to short circuit the built in ajax method being called
        // onFileRemoving will trigger the completed/failed callback
        (<any>this.widget).removeUploadedFile = function async(file, eventArgs, removeDirectly, custom) {
          let formData = new FormData();
          let selectedFiles = file;

          (<any>_this.widget).trigger("removing", eventArgs, function (eventArgs) {
            (<any>_this.widget).removingEventCallback(eventArgs, formData, selectedFiles, file);
          });
        };
      }
    }
  }

  protected onWidgetCreated() {
    if (this.widget.files) {
      let extraProperties = [];
      let widgetFiles = this.widget.getFilesData();

      if (this.mapAdditionalFilePropertiesToFiles) {
        extraProperties = this.getAdditionalFileProperties();
      }

      for (let i = 0; i < widgetFiles.length; i++) {
        const file = widgetFiles[i];
        let __id = uid();
        file[this._privateIdProperty] = __id;
        this[this._filesProperty][i][this._privateIdProperty] = __id;

        extraProperties.forEach((prop) => {
          file[prop] = this[this._filesProperty][i][prop];
        });
      }
    }
  }

  change() {
    if (this.autoRemoveServerFiles) {
      this.getFilesToDelete();
    }
  }

  async getFilesToDelete() {
    let widgetFiles = this.widget.getFilesData();
    if (this[this._filesProperty].length !== widgetFiles.length) {
      for (let i = 0; i < this[this._filesProperty].length; i++) {
        const file = this[this._filesProperty][i];
        if (!widgetFiles.find((x) => x[this._privateIdProperty] === file[this._privateIdProperty])) {
          this.info("file not found", file);

          this.widget.remove(file);
        }
      }
    }
  }

  async removing(args: RemovingEventArgs) {
    if (this.onRemoving !== undefined && typeof this.onRemoving === "function") {
      this.onRemoving.call(this, args);
      if (args.cancel) {
        // Not sure how to stop the spinner
        return;
      }
    }

    if (this.dataAdapter && this.dataAdapter.remove) {
      try {
        await this.dataAdapter.remove(args.filesData[0]);
        this.onRemoveSuccess(args);
        this.onWidgetRemoveComplete(null, args);
      } catch (error) {
        this.onWidgetRemoveFailed(error, args);
      }
    }

    this.onRemoveSuccess(args)
  }

  onWidgetRemoveComplete(response, args) {
    (<any>this.widget).removeCompleted(response, args.filesData[0], false);
  }

  onWidgetRemoveFailed(e, args) {
    (<any>this.widget).removeFailed(e, args.filesData[0], false);
  }

  onRemoveSuccess(args) {
    let _file: any = args.filesData[0];
    let index = this[this._filesProperty].findIndex((x: any) => x.__id === _file.__id);
    this[this._filesProperty].splice(index, 1);

    this.onSuccess.call(this, args);
  }

  success(args: any): void {
    if (args.operation === "upload") {
      let response = JSON.parse(args.e.target.response);
      let _uploadedFile = args.file;
      let fileName = (<string>_uploadedFile.name).substr(0, _uploadedFile.name.length - (_uploadedFile.type.length + 1));

      // map response values
      let additionalProperties = {};
      additionalProperties[this._privateIdProperty] = uid();

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

      if (this[this._filesProperty] === null) {
        this[this._filesProperty] = [];
      }

      this[this._filesProperty].push(file);

      if (this.onSuccess !== undefined && typeof this.onSuccess === "function") {
        this.onSuccess.call(this, args);
      }
    }
    else if (args.operation === "remove") {

    }
  }

  failure(args: any): void {
    if (this.onFailure !== undefined && typeof this.onFailure === "function") {
      this.onFailure.call(this, args);
    }
  }

  private getAdditionalFileProperties() {
    let extraProperties: string[] = [];

    if (this[this._filesProperty] && this[this._filesProperty].length > 0) {
      for (let prop in this[this._filesProperty][0]) {
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
      this.onUploading.call(this, args);
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
  remove(file: any): Promise<void>;
}

export interface Ej2UploaderRemove {

}
