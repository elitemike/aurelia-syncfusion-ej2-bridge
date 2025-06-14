import { inlineView, customElement, bindable } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';
import {
    RichTextEditor, RichTextEditorModel, Count, FileManager, EmojiPicker,
    FormatPainter, Toolbar, SlashMenu, ImportExport, Link, Image, HtmlEditor,
    QuickToolbar, Table, Video, Audio, PasteCleanup,
    ToolbarConfigItems,
    ToolbarType
} from '@syncfusion/ej2-richtexteditor';

@generateBindables("richTextEditor")
@inlineView(`<template><div element.ref="widgetElement"></div></template>`)
@customElement('ej2-rich-text-editor')
export class Ej2RichTextEditor extends SyncfusionWrapper<RichTextEditor, RichTextEditorModel> {
    private defaultToolbarItems: ToolbarConfigItems[] = [
        'Undo',
        'Redo',
        '|',
        'Bold',
        'Italic',
        'Underline',
        'StrikeThrough',
        'InlineCode',
        'SuperScript',
        'SubScript',
        '|',
        'FontName',
        'FontSize',
        'FontColor',
        'BackgroundColor',
        '|',
        'LowerCase',
        'UpperCase',
        '|',
        'Formats',
        'Alignments',
        'Blockquote',
        '|',
        'NumberFormatList',
        'BulletFormatList',
        '|',
        'Outdent',
        'Indent',
        '|',
        'CreateLink',
        'CreateTable',
        '|',
        'FormatPainter',
        'ClearFormat',
        '|', 'EmojiPicker', 'Print', '|',
        'SourceCode', 'FullScreen'
    ];


    protected syncfusionWidgetType: any = RichTextEditor;
    protected onWrapperCreated() {
    }
    protected onWidgetCreated() {
        this.widget.change = () => { this.onChange() }
    }

    onBeforeWidgetInstantiation() {
        this.info("e-toolbarSettings", this['e-toolbarSettings'])

        if (!this['e-toolbarSettings'] && !this._eModel.toolbarSettings?.items) {
            this._eModel.toolbarSettings = {
                items: this.defaultToolbarItems
            }
        }

        if (this._eModel.toolbarSettings?.items) {
            if (this._eModel.toolbarSettings.items.includes("Image")) {
                RichTextEditor.Inject(Image);
            }

            if (this._eModel.toolbarSettings.items.includes("Audio")) {
                RichTextEditor.Inject(Audio);
            }

            if (this._eModel.toolbarSettings.items.includes("Video")) {
                RichTextEditor.Inject(Video);
            }

            if (this._eModel.toolbarSettings.items.includes("FileManager") && this._eModel.fileManagerSettings?.enable) {
                RichTextEditor.Inject(FileManager);
            }

            if (this._eModel.toolbarSettings.items.includes("EmojiPicker")) {
                RichTextEditor.Inject(EmojiPicker);
            }
        }

        if (!this['e-slashMenuSettings'] && !this._eModel.slashMenuSettings?.enable) {
            RichTextEditor.Inject(SlashMenu);
        }

        RichTextEditor.Inject(Toolbar, Link, Count, HtmlEditor, QuickToolbar, Table, FormatPainter, PasteCleanup, ImportExport);
    }

    onChange() {
        this[`${constants.bindablePrefix}value`] = this.widget.value;
    }
}
