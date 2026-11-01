import { Ej2ImageEditor } from 'widgets/imageEditor/ej2-imageEditor';
import { viewResources } from 'aurelia-framework';
/** Builds a small local PNG so the demo never needs a network image. */
function makeImage(width: number, height: number, color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(width / 4, height / 4, width / 2, height / 2);
  ctx.fillStyle = '#d32f2f';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, Math.min(width, height) / 6, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toDataURL('image/png');
}

@viewResources(Ej2ImageEditor)
export class ImageEditorDemo {
  editor: any;
  templateEditor: any;
  customEditor: any;
  showDestroy = true;
  image = makeImage(400, 300, '#1976d2');
  secondImage = makeImage(200, 150, '#388e3c');

  // properties
  width = '640px';
  height = '440px';
  theme = 'Material3';
  cssClass = 'my-image-editor';
  disabled = false;
  isReadOnly = false;
  allowUndoRedo = true;
  showQuickAccessToolbar = true;
  imageSmoothingEnabled = true;
  fontFamily = { default: 'Arial', items: [{ text: 'Arial', value: 'Arial' }, { text: 'Courier New', value: 'Courier New' }] };
  finetuneSettings = {
    brightness: { min: -50, max: 50, defaultValue: 0 },
    contrast: { min: -50, max: 50, defaultValue: 0 }
  };
  zoomSettings = { zoomTrigger: 'MouseWheel,Pinch,Toolbar,Commands', minZoomFactor: 0.5, maxZoomFactor: 5, zoomFactor: 1 };
  selectionSettings = { showCircle: true, strokeColor: '#ff0000', fillColor: '#00ff00' };
  uploadSettings = { allowedExtensions: '.png, .jpg', minFileSize: 1, maxFileSize: 5000000 };
  toolbar = ['Open', 'Undo', 'Redo', 'Crop', 'Transform', 'Annotate', 'Finetune', 'Filter', 'Frame', 'Resize', 'ZoomIn', 'ZoomOut', 'Reset', 'Save'];
  customToolbar = [{ text: 'Custom', id: 'custom-item', tooltipText: 'custom action' }, 'Undo'];

  counts: { [name: string]: number } = {};
  lastShapeId = '';

  log(name: string, args?: any) {
    this.counts = { ...this.counts, [name]: (this.counts[name] || 0) + 1 };
    if (name === 'shapeChanging' || name === 'shapeChange') {
      const id = args && args.currentShapeSettings && args.currentShapeSettings.id;
      if (id) { this.lastShapeId = id; }
    }
  }

  get countsText() { return JSON.stringify(this.counts); }

  setSize() { this.width = '500px'; this.height = '380px'; }
  openImage() { this.editor.widget.open(this.image); }
  openSecond() { this.editor.widget.open(this.secondImage); }
  zoom() { this.editor.widget.zoom(2); }
  pan() { this.editor.widget.pan(true, 10, 10); }
  rotate() { this.editor.widget.rotate(90); }
  flip() { this.editor.widget.flip('Horizontal'); }
  select() { this.editor.widget.select('Square'); }
  cropApply() { this.editor.widget.select('Square'); this.editor.widget.crop(); }
  drawRectangle() {
    const d = this.editor.widget.getImageDimension();
    this.editor.widget.drawRectangle(d.x + 20, d.y + 20, 100, 60, 3, '#ff0000', '#ffff00', 0, true);
  }
  drawText() {
    const d = this.editor.widget.getImageDimension();
    this.editor.widget.drawText(d.x + 30, d.y + 100, 'Hello', 'Arial', 20, false, false, '#000000', true);
  }
  updateShape() {
    const shape = this.editor.widget.getShapeSettings()[0];
    this.editor.widget.updateShape({ id: shape.id, type: shape.type, strokeColor: '#00ff00' }, true);
  }
  openCustom() { this.customEditor.widget.open(this.image); }
  filter() { this.editor.widget.applyImageFilter('Sepia'); }
  finetune() { this.editor.widget.finetuneImage('Brightness', 20); }
  frame() { this.editor.widget.drawFrame('Mat', '#ff0000', '', 10); }
  resize() { this.editor.widget.resize(200, 150); }
  undo() { this.editor.widget.undo(); }
  save() { this.editor.widget.export('Png', 'demo'); }
}
