import { BlockEditor, BlockEditorModel } from '@syncfusion/ej2-blockeditor';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
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

  // Assigning `blocks` on a rendered editor hands the raw objects to the renderer, which expects the defaults the
  // widget only fills in while constructing (content items without them throw). Going through the public
  // renderBlocksFromJson API normalizes the blocks.
  blocksChanged(newValue: any) {
    const latest = this[`${constants.bindablePrefix}blocks`];
    const widget: any = this.widget;
    if (!widget || !Array.isArray(latest)) {
      return;
    }
    widget.setProperties({ blocks: latest }, true);
    widget.renderBlocksFromJson(JSON.parse(JSON.stringify(latest)), true);
  }

  // The widget adds the new css classes on change but leaves the previous ones on the element.
  cssClassChanged(newValue: any) {
    const latest = this[`${constants.bindablePrefix}cssClass`] || '';
    const widget: any = this.widget;
    if (!widget) {
      return;
    }
    const previous = (widget.cssClass || '').split(/\s+/).filter(c => c);
    widget.cssClass = latest;
    const next = latest.split(/\s+/).filter(c => c);
    previous.filter(c => next.indexOf(c) === -1).forEach(c => widget.element.classList.remove(c));
  }
}
