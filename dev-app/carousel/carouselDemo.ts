export class CarouselDemo {
  // default sample
  items = this.makeItems();
  selectedIndex = 1;
  changingCount = 0;
  changedCount = 0;
  lastCurrent = -1;
  lastNext = -1;
  blockNext = false;
  loop = true;
  effect = 'Slide';

  // autoplay
  autoItems = this.makeItems();
  autoPlay = false;
  interval = 400;
  pauseOnHover = true;
  showPlayButton = true;

  // indicators and buttons
  dotItems = this.makeItems();
  fractionItems = this.makeItems();
  progressItems = this.makeItems();
  dynamicItems = this.makeItems(8);
  showIndicators = true;
  buttonsVisibility = 'Visible';

  // templates and data source
  templateItems = this.makeItems();
  previousTemplate = '<button class="c-prev-tpl">Back</button>';
  nextTemplate = '<button class="c-next-tpl">Forward</button>';
  indicatorsTemplate = '<span class="c-ind-tpl">o</span>';
  playTemplate = '<button class="c-play-tpl">Play it</button>';
  records = [{ title: 'First record' }, { title: 'Second record' }, { title: 'Third record' }];
  itemTemplate = '<div class="c-record">${title}</div>';

  // misc
  miscItems = this.makeItems();
  partialVisible = true;
  swipeMode = 'Touch';
  touchSwipe = true;
  keyboard = true;
  cssClass = 'c-one';
  htmlAttributes = { 'data-custom': 'yes' };
  width = '420px';
  height = '120px';

  makeItems(count = 4): any[] {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({ template: `<div class="c-slide">Slide ${i}</div>` });
    }
    return items;
  }

  onSlideChanging(event: CustomEvent) {
    this.changingCount++;
    this.lastCurrent = event.detail.currentIndex;
    this.lastNext = event.detail.nextIndex;
    if (this.blockNext && event.detail.nextIndex === 3) {
      event.detail.cancel = true;
    }
  }

  onSlideChanged() { this.changedCount++; }

  select(index: number) { this.selectedIndex = index; }
  block() { this.blockNext = true; }
  noLoop() { this.loop = false; }
  fade() { this.effect = 'Fade'; }
  play() { this.autoPlay = true; }
  hideIndicators() { this.showIndicators = false; }
  hover() { this.buttonsVisibility = 'VisibleOnHover'; }
  restyle() { this.cssClass = 'c-two'; }
  full() { this.partialVisible = false; }
  mouseSwipe() { this.swipeMode = 'Mouse'; }
  noTouch() { this.touchSwipe = false; }
  noKeyboard() { this.keyboard = false; }
  resize() { this.width = '300px'; this.height = '90px'; }
  stopPause() { this.pauseOnHover = false; }
}
