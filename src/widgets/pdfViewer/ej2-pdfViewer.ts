import {
  PdfViewer, PdfViewerModel, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
  TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, AccessibilityTags, PageOrganizer,
  WebMcpPdfViewer
} from '@syncfusion/ej2-pdfviewer';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

// events after which isDocumentEdited may have changed
const editEvents = [
  'annotationAdd', 'annotationRemove', 'annotationPropertiesChange', 'annotationChanged', 'annotationResize',
  'annotationMove', 'formFieldAdd', 'formFieldRemove', 'formFieldPropertiesChange', 'formFieldChanged',
  'formFieldMove', 'formFieldResize', 'addSignature', 'removeSignature', 'moveSignature', 'resizeSignature',
  'signaturePropertiesChange', 'importSuccess', 'documentUnload', 'documentLoad'
];

// Syncfusion resets these when a document is loaded, the bound value is applied again afterwards
const resetOnLoad = ['interactionMode', 'customContextMenuItems'];

@generateBindables("pdfViewer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pdf-viewer')
export class Ej2PdfViewer extends SyncfusionWrapper<PdfViewer, PdfViewerModel> {
  protected syncfusionWidgetType = PdfViewer;
  private listeners: { name: string, handler: (args: any) => void }[] = [];

  protected onBeforeWidgetInstantiation() {
    // PdfViewer.Inject registers modules globally and the viewer only activates the ones whose enable* flag is set,
    // so the full set is injected once.
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection,
      TextSearch, Print, Annotation, FormFields, FormDesigner, AccessibilityTags, PageOrganizer,
      WebMcpPdfViewer);
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    const listen = (name: string, handler: (args: any) => void) => {
      this.listeners.push({ name, handler });
      this.widget.addEventListener(name, handler);
    };
    // state that the user changes or the document determines is reported back to the bindings
    const report = (...names: string[]) => () => {
      names.forEach((name) => {
        if (this.widget) { this[`${constants.bindablePrefix}${name}`] = this.widget[name]; }
      });
    };

    listen('documentLoad', report('pageCount', 'currentPageNumber', 'zoomValue', 'isDocumentEdited'));
    listen('documentUnload', report('pageCount', 'isDocumentEdited'));
    listen('pageChange', report('currentPageNumber'));
    listen('zoomChange', report('zoomValue'));
    editEvents.forEach((name) => listen(name, report('isDocumentEdited')));
    this.observeDocumentEdited(report('isDocumentEdited'));
    listen('documentLoad', () => {
      resetOnLoad.forEach((name) => {
        const bound = this[`${constants.bindablePrefix}${name}`];
        if (bound !== undefined && bound !== null && JSON.stringify(this.widget[name]) !== JSON.stringify(bound)) {
          this.widget[name] = bound;
        }
      });
    });
  }

  /**
   * The viewer assigns isDocumentEdited after it raised the edit events and offers no event for it, so the
   * property setter of this instance is wrapped to report the value as soon as it is written.
   */
  private observeDocumentEdited(report: () => void) {
    const widget: any = this.widget;
    let proto = Object.getPrototypeOf(widget);
    let descriptor: PropertyDescriptor;
    while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, 'isDocumentEdited'))) {
      proto = Object.getPrototypeOf(proto);
    }
    if (descriptor && descriptor.set && descriptor.get) {
      Object.defineProperty(widget, 'isDocumentEdited', {
        configurable: true,
        enumerable: true,
        get: () => descriptor.get.call(widget),
        set: (value: boolean) => {
          descriptor.set.call(widget, value);
          report();
        }
      });
    }
  }

  /** Changing the bound page navigates, assigning the property alone would not scroll the document. */
  protected currentPageNumberChanged(value: number) {
    const widget: any = this.widget;
    const page = Number(value);
    if (!widget || !page || widget.currentPageNumber === page) { return; }
    if (widget.pageCount > 0 && widget.navigationModule) {
      widget.navigation.goToPage(page);
    } else {
      widget.currentPageNumber = page;
    }
  }

  /** Changing the bound zoom value zooms the document. */
  protected zoomValueChanged(value: number) {
    const widget: any = this.widget;
    const zoom = Number(value);
    if (!widget || !zoom || widget.zoomValue === zoom) { return; }
    if (widget.pageCount > 0 && widget.magnificationModule) {
      widget.magnification.zoomTo(zoom);
    } else {
      widget.zoomValue = zoom;
    }
  }

  public detached() {
    if (this.widget) {
      this.listeners.forEach(({ name, handler }) => (this.widget as any).removeEventListener(name, handler));
    }
    this.listeners = [];
    super.detached();
  }
}
