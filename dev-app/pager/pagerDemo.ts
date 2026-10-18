export class PagerDemo {
  total = 100;
  pageSize = 10;
  currentPage = 1;
  clickCount = 0;

  onClick() {
    this.clickCount++;
  }

  goTo(page: number) {
    this.currentPage = page;
  }
}
