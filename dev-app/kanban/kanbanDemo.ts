import { PLATFORM } from 'aurelia-pal';
import { kanbanData, statusColumns, cardSettings, clone } from './kanbanData';
import { logEvent } from './kanbanLog';
import { Ej2Kanban } from 'widgets/kanban/ej2-kanban';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Kanban)
export class KanbanDemo {
  log = logEvent;
  parts = [
    PLATFORM.moduleName('kanban/kanbanBoardDemo'),
    PLATFORM.moduleName('kanban/kanbanDataDemo')
  ];

  data = clone(kanbanData);
  columns = statusColumns;
  cardSettings = cardSettings;
  sortSettings = { sortBy: 'Index', field: 'RankId', direction: 'Ascending' };
  state = { height: '420px', width: 'auto', cardHeight: '110px', cssClass: 'kb-custom', keyboard: true };

  changeLook() {
    this.state.height = '360px';
    this.state.cardHeight = '130px';
    this.state.cssClass = 'kb-changed';
  }
}
