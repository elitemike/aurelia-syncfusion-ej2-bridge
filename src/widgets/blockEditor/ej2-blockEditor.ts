import { BlockEditor, BlockEditorModel } from '@syncfusion/ej2-blockeditor';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("blockEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-block-editor')
export class Ej2BlockEditor extends SyncfusionWrapper<BlockEditor, BlockEditorModel> {
  protected syncfusionWidgetType = BlockEditor;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
