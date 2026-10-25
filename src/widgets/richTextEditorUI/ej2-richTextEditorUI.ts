import { RichTextEditorUI, RichTextEditorUIModel, SlashCommand } from '@syncfusion/ej2-richtexteditor-ui';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("richTextEditorUI")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-rich-text-editor-ui')
export class Ej2RichTextEditorUI extends SyncfusionWrapper<RichTextEditorUI, RichTextEditorUIModel> {
  protected syncfusionWidgetType = RichTextEditorUI;
  private onChange: () => void = null;

  protected onBeforeWidgetInstantiation() {
    // the editor derives the id of its editable area from the host id, without one every editor ends up with the
    // same `_edit-view` id
    if (!this.widgetElement.id) {
      this.widgetElement.id = `rte-ui-${nextId++}`;
    }
    // the slash command module is only instantiated for editors whose slashCommandSettings.enable is on
    RichTextEditorUI.Inject(SlashCommand);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    this.onChange = () => {
      // the editor refreshes its `value` (html string or document, see valueFormat) before it raises `change`
      this[`${constants.bindablePrefix}value`] = this.widget.value;
    };
    this.widget.addEventListener('change', this.onChange);
  }

  // Setting `value` on a rendered RichTextEditorUI does not update the editor (EditorCore.onPropertyChanged looks for
  // `valueFormat` on a payload that only carries `value`, so it always takes the document branch with the wrong
  // object). Push the content into the headless editor ourselves and keep the widget property in sync silently.
  valueChanged(newValue: any) {
    const latest = this[`${constants.bindablePrefix}value`];
    const widget: any = this.widget;
    if (!widget || latest === undefined || latest === widget.value) {
      return;
    }
    widget.setProperties({ value: latest }, true);
    const editor = widget.baseEditorCore && widget.baseEditorCore.editor;
    if (!editor) {
      return;
    }
    if (widget.valueFormat === 'html' && typeof latest === 'string') {
      editor.setContent(latest);
    } else if (latest && typeof latest === 'object') {
      editor.setDocument(latest);
    }
  }

  // `enable` is only honored while rendering, the widget has no property change handler for it
  enableChanged(newValue: any) {
    const latest = this[`${constants.bindablePrefix}enable`];
    const widget: any = this.widget;
    if (!widget || latest === undefined) {
      return;
    }
    const enable = latest === true || latest === 'true';
    widget.setProperties({ enable }, true);
    widget.updateEnable(enable);
  }

  public detached() {
    if (this.widget && this.onChange) {
      this.widget.removeEventListener('change', this.onChange);
    }
    super.detached();
  }
}
