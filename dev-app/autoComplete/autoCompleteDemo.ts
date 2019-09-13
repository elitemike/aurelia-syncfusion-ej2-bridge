import { AutoCompleteModel } from '@syncfusion/ej2-dropdowns';
export class AutoCompleteDemo {

  sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];

  model: AutoCompleteModel = null;

  constructor() {
    this.model = {
      dataSource: this.sportsData
    };
  }
}
