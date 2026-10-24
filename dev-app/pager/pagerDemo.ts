export class PagerDemo {
  total = 100;
  pageSize = 10;
  currentPage = 1;
  clickCount = 0;
  pageCount = 3;
  createdCount = 0;
  dropDownChangedCount = 0;
  lastDropDownSize = 0;
  tpl = '<span class="my-pager-tpl">Template pager</span>';

  onClick() {
    this.clickCount++;
  }

  goTo(page: number) {
    this.currentPage = page;
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }

  setTotal(total: number) {
    this.total = total;
  }

  onCreated() {
    this.createdCount++;
  }

  onDropDownChanged(event: CustomEvent) {
    this.dropDownChangedCount++;
    this.lastDropDownSize = event.detail.pageSize;
  }
}
