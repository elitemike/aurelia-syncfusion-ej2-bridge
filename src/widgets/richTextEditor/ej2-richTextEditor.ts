import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { RichTextEditor, RichTextEditorModel, Count, FileManager, EmojiPicker, FormatPainter, Toolbar, SlashMenu, ImportExport, Link, Image, HtmlEditor, QuickToolbar, Table, Video, Audio, PasteCleanup } from '@syncfusion/ej2-richtexteditor';



@generateBindables("richTextEditor")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-rich-text-editor')
export class Ej2RichTextEditor extends SyncfusionWrapper<RichTextEditor, RichTextEditorModel> {
    protected syncfusionWidgetType: any = RichTextEditor;
    protected onWrapperCreated() {
    }
    protected onWidgetCreated() {
        this.widget.addEventListener("change", (args: any) => { this.onChange(args); });
    }

    onChange(args: any) {
        this[`${constants.bindablePrefix}value`] = args.value;
    }

    onBeforeWidgetInstantiation() {
        RichTextEditor.Inject(Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table, FileManager,
            EmojiPicker, Audio, Video, FormatPainter, PasteCleanup, SlashMenu, ImportExport);
    }
}
