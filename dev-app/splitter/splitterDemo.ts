import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { SplitterModel, Splitter } from '@syncfusion/ej2-layouts';

export class SplitterDemo {
  private horizontalSplitter: IEJ2WidgetBridge<Splitter> = null;

  public horizontalModel: SplitterModel = {
    height: '385px',
    paneSettings: [
      { size: '48%', collapsible: true },
      { collapsible: true }
    ],
    separatorSize: 3,
    width: '100%'
  };

  public verticalModel: SplitterModel = {
    paneSettings: [
      { size: '50%', collapsible: true },
      { collapsible: true }
    ],
    separatorSize: 3,
    orientation: 'Vertical',
    width: "100%",
    height: "385px"
  };
}
