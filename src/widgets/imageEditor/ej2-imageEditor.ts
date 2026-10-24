import { ImageEditor, ImageEditorModel } from '@syncfusion/ej2-image-editor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("imageEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-image-editor')
export class Ej2ImageEditor extends SyncfusionWrapper<ImageEditor, ImageEditorModel> {
  protected syncfusionWidgetType = ImageEditor;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
