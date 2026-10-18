export class DateTimeIsoValueConverter {
  toView(value: Date) {
    if (!value) { return ''; }
    const p = (n: number) => String(n).padStart(2, '0');
    return `${value.getFullYear()}-${p(value.getMonth() + 1)}-${p(value.getDate())} ${p(value.getHours())}:${p(value.getMinutes())}`;
  }
}
