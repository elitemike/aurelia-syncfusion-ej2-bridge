export interface IEJ2WidgetBridge<T> {
  refresh(): void;
  recreate(): void;
  dataBind(): void;
  widget: T;
}
