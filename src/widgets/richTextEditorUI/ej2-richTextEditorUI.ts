import { RichTextEditorUI, RichTextEditorUIModel } from '@syncfusion/ej2-richtexteditor-ui';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("richTextEditorUI")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-rich-text-editor-ui')
export class Ej2RichTextEditorUI extends SyncfusionWrapper<RichTextEditorUI, RichTextEditorUIModel> {
  protected syncfusionWidgetType = RichTextEditorUI;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
