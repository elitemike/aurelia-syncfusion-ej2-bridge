import { DataManager, Query } from '@syncfusion/ej2-data';

export class MentionDemo {
  people = [
    { Name: 'Selma Rose', EmailId: 'selma@mail.com' },
    { Name: 'Maria', EmailId: 'maria@mail.com' },
    { Name: 'Russo Kay', EmailId: 'russo@mail.com' },
    { Name: 'Robert', EmailId: 'robert@mail.com' },
    { Name: 'Garth Rod', EmailId: 'garth@mail.com' }
  ];
  fields = { text: 'Name' };

  counts: any = { created: 0, actionBegin: 0, actionComplete: 0, filtering: 0, beforeOpen: 0, opened: 0, closed: 0 };
  selected = '';
  changed = '';
  cancelSelect = false;

  o: any = {
    mentionChar: '@', showMentionChar: false, suffixText: '', suggestionCount: 8, minLength: 0, allowSpaces: false,
    requireLeadingSpace: true, ignoreCase: true, highlight: false, sortOrder: 'None', filterType: 'StartsWith',
    popupWidth: '200px', popupHeight: '150px', debounceDelay: 100, cssClass: 'mn-custom'
  };

  itemTpl = '<span class="mn-item-tpl">Person ${Name}</span>';
  displayTpl = '<span class="mn-display-tpl">[${Name}]</span>';
  noRecordsTpl = '<span class="mn-none-tpl">Nobody found</span>';
  spinnerTpl = '<span class="mn-spinner-tpl">Loading people</span>';
  slow = new DataManager({ url: '/api/mn-slow' });

  manager = new DataManager(this.people);
  query = new Query().take(2);

  failing = new DataManager({ url: '/api/mn-fail' });
  failures = 0;
  destroyed = 0;
  showFail = true;

  count(name: string) {
    this.counts[name]++;
  }

  onSelect(event: CustomEvent) {
    this.selected = event.detail.itemData && event.detail.itemData.Name;
    if (this.cancelSelect) {
      event.detail.cancel = true;
    }
  }

  onChange(event: CustomEvent) {
    this.changed = String(event.detail.value);
  }

  changeOptions() {
    this.o = {
      mentionChar: '#', showMentionChar: true, suffixText: '!', suggestionCount: 2, minLength: 1, allowSpaces: true,
      requireLeadingSpace: false, ignoreCase: false, highlight: true, sortOrder: 'Descending', filterType: 'Contains',
      popupWidth: '300px', popupHeight: '120px', debounceDelay: 50, cssClass: 'mn-custom-two'
    };
  }
}
