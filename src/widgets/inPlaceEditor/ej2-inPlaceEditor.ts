import {
  InPlaceEditor, InPlaceEditorModel, Slider, ColorPicker, MultiSelect, ComboBox, AutoComplete, TimePicker,
  DateRangePicker, Rte
} from '@syncfusion/ej2-inplace-editor';
import { RichTextEditor, Toolbar, Link, Image, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-richtexteditor';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("inPlaceEditor")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-in-place-editor')
export class Ej2InPlaceEditor extends SyncfusionWrapper<InPlaceEditor, InPlaceEditorModel> {
  protected syncfusionWidgetType = InPlaceEditor;
  private onChange: (args: any) => void = null;

  // The in-place editor property `model` (the options of the inner editor) hyphenates to `e-model`, which is
  // also the bridge-wide `eModel` bindable that carries the options of the whole widget (ControlBase.eModel).
  // For this control `e-model` is always the inner editor model, so take it out of the generic options object.
  private innerModel: any = null;

  bind(context) {
    this.innerModel = (<any>this).eModel || null;
    (<any>this).eModel = null;
    super.bind(context);
  }

  eModelChanged(newValue: any) {
    if (!newValue || !this.widget) {
      return;
    }
    this.innerModel = newValue;
    // picked up by the next render of the editor
    this.widget.setProperties({ model: Object.assign({}, newValue) }, true);
  }

  protected onBeforeWidgetInstantiation() {
    // the editor writes its runtime state (value, cssClass, showClearButton...) into the `model` object it receives,
    // hand it a copy so a model shared through the view-model is not polluted and shared between editors
    if (this.innerModel && typeof this.innerModel === 'object') {
      (<any>this._eModel).model = Object.assign({}, this.innerModel);
    }

    // the editor types AutoComplete, Color, ComboBox, DateRange, MultiSelect, RTE, Slider and Time are modules
    InPlaceEditor.Inject(Slider, ColorPicker, MultiSelect, ComboBox, AutoComplete, TimePicker, DateRangePicker, Rte);
    // the RTE editor type renders a Rich Text Editor that needs its own modules
    RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, QuickToolbar, Table);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // The widget `change` event is raised for every change of the inner editor, before anything is submitted, so it
    // must not write back. `actionSuccess` is raised once the submitted value was accepted (locally or by the server).
    this.onChange = () => {
      this[`${constants.bindablePrefix}value`] = this.widget.value;
    };
    this.widget.addEventListener('actionSuccess', this.onChange);
  }

  public detached() {
    if (this.widget && this.onChange) {
      this.widget.removeEventListener('actionSuccess', this.onChange);
    }
    super.detached();
  }
}
