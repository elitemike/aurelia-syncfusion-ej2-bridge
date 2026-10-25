export class FormBuilderDemo {
  counts: { [key: string]: number } = { dragStarted: 0, dragOver: 0, dropped: 0, propertyChanged: 0 };
  dragType = '';
  droppedType = '';
  propertyName = '';

  mode = 'Simple';
  allowExport = true;
  enablePreview = true;

  schema = {
    version: '1.0',
    properties: {
      fullName: { id: 'fullName', name: 'fullName', type: 'string', widget: 'textbox', label: 'Full name', required: true },
      email: { id: 'email', name: 'email', type: 'string', widget: 'textbox', label: 'Email', format: 'email' }
    },
    layout: [
      { type: 'field', propertyId: 'fullName' },
      { type: 'field', propertyId: 'email' }
    ]
  };

  toolboxCategories = [
    { category: 'basic', items: ['textbox', 'checkbox'] },
    { category: 'advanced', items: ['rating'] }
  ];
  toolboxItems: any[] = [{ type: 'checkbox', template: '<div class="fb-custom-palette">Fancy checkbox</div>' }];
  formTemplates = [
    {
      id: 'tpl-contact', title: 'Contact form',
      schema: {
        version: '1.0',
        properties: { contactName: { id: 'contactName', name: 'contactName', type: 'string', widget: 'textbox', label: 'Contact name' } },
        layout: [{ type: 'field', propertyId: 'contactName' }]
      }
    }
  ];

  hideTools() {
    this.allowExport = false;
    this.enablePreview = false;
  }

  count(name: string) {
    this.counts[name]++;
  }

  onDragStarted(event: CustomEvent) {
    this.count('dragStarted');
    this.dragType = String(event.detail.componentType);
  }

  onDropped(event: CustomEvent) {
    this.count('dropped');
    this.droppedType = String(event.detail.componentType);
  }

  onPropertyChanged(event: CustomEvent) {
    this.count('propertyChanged');
    this.propertyName = String(event.detail.propertyName);
  }
}
