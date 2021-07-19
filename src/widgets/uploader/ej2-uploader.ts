import { Disposable } from 'aurelia-binding';
import { constants } from '../../common/constants';
import { Uploader, UploaderModel, UploadingEventArgs, RemovingEventArgs } from "@syncfusion/ej2-inputs";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";
import { bindable } from 'aurelia-framework';
import { RemoveEventArgs } from '@syncfusion/ej2-navigations';
import { v4 as uuid } from "uuid";
import { inlineView, customElement } from 'aurelia-framework';

@generateBindables("uploader")
@inlineView(`<template><input element.ref="widgetElement" type="file" name="UploadFiles" /></template>`)
@customElement('ej2-uploader')
export class Ej2Uploader extends SyncfusionWrapper<Uploader, UploaderModel> {
  private _filesProperty = `${constants.bindablePrefix}files`;
  private originalFiles = null;
  private _filesCollectionSubscription: Disposable = null;
  private _privateIdProperty = "__id";
  protected syncfusionWidgetType = Uploader;

  public mapAdditionalFilePropertiesToFiles: boolean = true;
  public sendAdditionalFilePropertiesAsFormData: boolean = true;

  @bindable
  public metadata: any = null;
  @bindable
  public formDataProperty = "metadata";
  @bindable
  public metadataGenerator: (file: object) => object = null;
  @bindable
  public uploadResultModel: object = null;
  @bindable
  public dataAdapter: Ej2UploaderDataAdapter = null;
  @bindable
  public autoRemoveServerFiles = true;
  @bindable
  public context: any = null;
  @bindable
  public files: any[] = null;

  private firstBind = true;

  private get _files(): any[] {
    return this[this._filesProperty];
  }

  /* only applicable if the data adapter remove method is used */
  @bindable
  public serverDelete: boolean = true;

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
        this.widget.asyncSettings.removeUrl = null;
      }
    }
  }


  onfilesChanged() {
    if (!this.firstBind) {
      this.widget.clearAll();
      this.recreate();
    }
  }

  recreating() {
    this._filesCollectionSubscription.dispose();
    (this[this._filesProperty] as any[]).splice(0, (this[this._filesProperty] as any[]).length, ...this.originalFiles);
  }

  recreated() {
    this.initializeFileCollection();
    this._filesCollectionSubscription = this.createFilesCollectionSubscription();
  }

  initializeFileCollection() {
    if (this.files && Array.isArray(this.files)) {
      // Only want a copy of the items to eliminate values updated by ref
      this.widget.files.push(...(JSON.parse(JSON.stringify(this.files)) as Array<any>));
    }

    if (this.widget.files) {
      // this.debug("widget files init", this.widget.getFilesData())
      let extraProperties = [];
      let widgetFiles = this.widget.getFilesData();
      // this.debug("widget files length", widgetFiles.length)
      if (this.mapAdditionalFilePropertiesToFiles) {
        extraProperties = this.getAdditionalFileProperties();
      }

      for (let i = 0; i < widgetFiles.length; i++) {
        //  this.debug("init loop");
        const file = widgetFiles[i];
        this.initializeFile(file, i, extraProperties);
      }
    }
    // this.debug("post init widget files", this.widget.files)
    // this.debug("post init files", this._files);
  }

  initializeFile(widgetFile, i, extraProperties) {
    // this.debug('init file', widgetFile);
    let __id = uuid();
    widgetFile[this._privateIdProperty] = __id;
    this._files[i][this._privateIdProperty] = __id;

    extraProperties.forEach((prop) => {
      widgetFile[prop] = this._files[i][prop];
    });
  }

  protected onWidgetCreated() {
    this.initializeFileCollection();
    this._filesCollectionSubscription = this.createFilesCollectionSubscription();
    this.subscriptions.push(this._filesCollectionSubscription);

  }

  onBind() {
    this.firstBind = false;
    this.subscriptions.push(this.bindingEngine.propertyObserver(this, "files").subscribe(() => { this.onfilesChanged(); }))
    if (this[this._filesProperty] && Array.isArray(this[this._filesProperty])) {
      this.originalFiles = (JSON.parse(JSON.stringify(this[this._filesProperty])) as Array<any>);
    } else if (this.files && Array.isArray(this.files)) {
      this.originalFiles = (JSON.parse(JSON.stringify(this.files)) as Array<any>);
    } else {
      this.originalFiles = [];
    }
  }

  createFilesCollectionSubscription() {
    if (!this._files) {
      this[this._filesProperty] = [];
    }

    return this.bindingEngine.collectionObserver(this._files).subscribe((changed) => { });
  }

  change() {
    if (this.autoRemoveServerFiles) {
      this.getFilesThatWereRemoved().forEach((file) => {
        this.removing({
          filesData: [file],
          customFormData: null,
          event: null,
          cancel: false
        });
        //this.removeFile(file);
      });
    }
  }

  getFilesThatWereRemoved(): any[] {
    let filesToRemove = [];
    let widgetFiles = this.widget.getFilesData();
    if (this[this._filesProperty].length !== widgetFiles.length) {
      for (let i = 0; i < this[this._filesProperty].length; i++) {
        const file = this[this._filesProperty][i];
        if (!widgetFiles.find((x) => x[this._privateIdProperty] === file[this._privateIdProperty])) {
          //  this.info("file not found", file);        
          filesToRemove.push(file);
        }
      }
    }

    return filesToRemove;
  }

  public removeAll() {
    this.widget.getFilesData().forEach((file) => {
      this.removeFile(file);
    });
  }

  public removeFile(file) {
    // this.debug("removeFile", file);
    this.widget.remove(file);
  }

  async removing(args: RemovingEventArgs) {
    // this.debug("removing", args);
    let event = new CustomEvent("on-removing", {
      bubbles: true,
      detail: args
    });

    this.element.dispatchEvent(event);

    if (args.cancel) {
      // Not sure how to stop the spinner
      return;
    }


    if (this.dataAdapter && this.dataAdapter.remove) {
      try {
        if (this.serverDelete) {
          await this.dataAdapter.remove.call(this.context || this.bindingContext, args.filesData[0]);
        }
        this.onRemoveSuccess(args);
        this.onWidgetRemoveComplete(null, args);
      } catch (error) {
        this.onWidgetRemoveFailed(error, args);
      }
    }

    // this.onRemoveSuccess(args)
  }

  onWidgetRemoveComplete(response, args) {
    (<any>this.widget).removeCompleted(response, args.filesData[0], false);
  }

  onWidgetRemoveFailed(e, args) {
    (<any>this.widget).removeFailed(e, args.filesData[0], false);
  }

  onRemoveSuccess(args) {
    // ("onRemoveSuccess", args);
    let _file: any = args.filesData[0];
    let index = this[this._filesProperty].findIndex((x: any) => x.__id === _file.__id);
    if (index !== -1) {
      const removedFile = this[this._filesProperty].splice(index, 1)[0];

      // this.info("files", this[this._filesProperty]);
      let event = new CustomEvent("on-remove-success", {
        bubbles: true,
        detail: { args: args, removedFile: removedFile }
      });

      this.element.dispatchEvent(event);
    }
  }

  success(args: any): void {
    if (args.operation === "upload") {
      let response = JSON.parse(args.e.target.response);
      let _uploadedFile = args.file;
      let fileName = (<string>_uploadedFile.name).substr(0, _uploadedFile.name.length - (_uploadedFile.type.length + 1));

      // map response values
      let additionalProperties = {};
      additionalProperties[this._privateIdProperty] = uuid();

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


      let uploadedEvent = new CustomEvent("on-uploaded", {
        bubbles: true,
        detail: { args: args, uploadedFile: file }
      });
      // console.log("file after upload", _uploadedFile)

      this.element.dispatchEvent(uploadedEvent);
      //  this.info("files", this[this._filesProperty])
    }
    else if (args.operation === "remove") {

    }

    let successEvent = new CustomEvent("on-success", {
      bubbles: true,
      detail: args
    });

    this.element.dispatchEvent(successEvent);
  }

  failure(args: any): void {
    let event = new CustomEvent("on-failure", {
      bubbles: true,
      detail: args
    });

    this.element.dispatchEvent(event);
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

    let event = new CustomEvent("on-uploading", {
      bubbles: true,
      detail: args
    });

    this.element.dispatchEvent(event);
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
      let _generatedMetadata = this.metadataGenerator.call(this.context || this.bindingContext, file);
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
